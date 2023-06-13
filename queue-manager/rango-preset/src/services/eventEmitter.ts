import mitt from 'mitt';
import {
  MainEvents,
  Route,
  RouteEvent,
  RouteEventTypes,
  RouteExecutionEvents,
  RouteExecutionMessageSeverity,
  Step,
  StepEvent,
  StepEventTypes,
} from '../types';
import { PendingSwap, PendingSwapStep, TransactionType } from 'rango-types/lib';
import { getCurrentBlockchainOfOrNull } from '../shared';

type Event = {
  eventType: StepEventTypes;
  swap: PendingSwap;
  step: PendingSwapStep | null;
  reason?: string;
  isApprovalTx?: boolean;
};

function isStepOnApproval(eventType: StepEventTypes) {
  return [
    StepEventTypes.SEND_TX,
    StepEventTypes.TX_SENT,
    StepEventTypes.CHECK_TX,
  ].includes(eventType);
}

function createSteps(swapSteps: PendingSwapStep[]): Step[] {
  return swapSteps.map((swapStep) => {
    const {
      diagnosisUrl,
      estimatedTimeInSeconds,
      explorerUrl,
      feeInUsd,
      executedTransactionId,
      executedTransactionTime,
      expectedOutputAmountHumanReadable,
      fromBlockchain,
      toBlockchain,
      fromSymbol,
      toSymbol,
      fromSymbolAddress,
      toSymbolAddress,
      swapperType,
      swapperId,
      outputAmount,
      fromAmountMaxValue,
      fromAmountMinValue,
      fromAmountPrecision,
      fromAmountRestrictionType,
      fromDecimals,
      status: stepStatus,
      cosmosTransaction,
      evmTransaction,
      evmApprovalTransaction,
      solanaTransaction,
      starknetTransaction,
      starknetApprovalTransaction,
      tronTransaction,
      tronApprovalTransaction,
      transferTransaction,
      networkStatus,
      internalSteps,
    } = swapStep;

    const baseStep = {
      diagnosisUrl,
      estimatedTimeInSeconds,
      explorerUrl,
      feeInUsd,
      executedTransactionId,
      executedTransactionTime,
      expectedOutputAmountHumanReadable,
      fromBlockchain,
      toBlockchain,
      fromSymbol,
      toSymbol,
      fromSymbolAddress,
      toSymbolAddress,
      swapperName: swapperId,
      swapperType,
      outputAmount,
      fromAmountMaxValue,
      fromAmountMinValue,
      fromAmountPrecision,
      fromAmountRestrictionType,
      fromDecimals,
      status: stepStatus,
    };

    let step: Step | undefined;

    if (evmTransaction || evmApprovalTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.EVM,
        transaction: evmTransaction,
        approvalTransaction: evmApprovalTransaction,
        networkStatus,
      };
    else if (tronTransaction || tronApprovalTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.TRON,
        transaction: tronTransaction,
        approvalTransaction: tronApprovalTransaction,
      };
    else if (starknetTransaction || starknetApprovalTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.STARKNET,
        transaction: starknetTransaction,
        approvalTransaction: starknetApprovalTransaction,
      };
    else if (cosmosTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.COSMOS,
        transaction: cosmosTransaction,
      };
    else if (solanaTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.SOLANA,
        transaction: solanaTransaction,
        internalSteps,
      };
    else if (transferTransaction)
      step = {
        ...baseStep,
        transactionType: TransactionType.TRANSFER,
        transaction: transferTransaction,
      };
    else
      step = {
        ...baseStep,
        transactionType: null,
      };

    return step;
  });
}

function getEventPayload(
  swap: PendingSwap,
  eventType: StepEventTypes | RouteEventTypes,
  swapStep?: PendingSwapStep
): { route: Route; step: Step } {
  const {
    creationTime,
    finishTime,
    requestId,
    inputAmount,
    status,
    wallets,
    steps,
    settings,
  } = swap;

  const routeSteps = createSteps(steps);
  const route: Route = {
    creationTime,
    finishTime,
    requestId,
    inputAmount,
    status,
    wallets,
    steps: routeSteps,
    slippage: settings.slippage,
    infiniteApproval: settings.infiniteApprove,
  };

  const result: { route: Route; step: Step } = {
    route,
    step: routeSteps[routeSteps.length - 1],
  };
  if (swapStep) result.step = createSteps([swapStep])[0];
  else {
    if (eventType === 'failed') {
      const failedStep = routeSteps
        .slice()
        .reverse()
        .find((step) => step.status === 'failed');
      if (failedStep) result.step = failedStep;
    } else {
      const lastSuccessfulStep = routeSteps
        .slice()
        .reverse()
        .find((step) => step.status === 'success');

      if (lastSuccessfulStep) result.step = lastSuccessfulStep;
    }
  }

  return result;
}

export const eventEmitter = mitt<RouteExecutionEvents>();

function emitRouteEvent(params: RouteEventParams) {
  const { event, message, messageSeverity, outputAmount, route } = params;
  const { eventType } = event;
  let routeEvent: RouteEvent | undefined;
  switch (eventType) {
    case StepEventTypes.STARTED:
      if (!event.step)
        routeEvent = {
          eventType: RouteEventTypes.STARTED,
          message,
          messageSeverity,
        };

      break;
    case StepEventTypes.FAILED:
      routeEvent = {
        eventType: RouteEventTypes.FAILED,
        message,
        messageSeverity,
        reason: event.reason,
      };

      break;
    case StepEventTypes.SUCCEEDED:
      if (!event.step)
        routeEvent = {
          eventType: RouteEventTypes.SUCCEEDED,
          message,
          messageSeverity,
          outputAmount,
        };

      break;
    default:
      break;
  }

  if (routeEvent)
    eventEmitter.emit(MainEvents.RouteEvent, { event: routeEvent, route });
}

function emitStepEvent(params: StepEventParams) {
  const { event, message, messageSeverity, outputAmount, route, step } = params;
  const { eventType } = event;

  let stepEvent: StepEvent | undefined;

  switch (eventType) {
    case StepEventTypes.STARTED:
      if (event.step) {
        stepEvent = { eventType, message, messageSeverity };
      }
      break;
    case StepEventTypes.FAILED:
      stepEvent = {
        eventType,
        message,
        messageSeverity,
        reason: event.reason,
      };
      break;
    case StepEventTypes.SUCCEEDED:
      if (event.step) {
        stepEvent = { eventType, message, messageSeverity, outputAmount };
      }
      break;

    default:
      if (isStepOnApproval(eventType))
        stepEvent = {
          eventType,
          message,
          messageSeverity,
          isApprovalTx: !!event.isApprovalTx,
        };
      break;
  }

  if (stepEvent)
    eventEmitter.emit(MainEvents.StepEvent, {
      event: stepEvent,
      route,
      step,
    });
}

interface RouteEventParams {
  event: Event;
  message: string;
  messageSeverity: RouteExecutionMessageSeverity;
  outputAmount: string;
  route: Route;
}

interface StepEventParams extends RouteEventParams {
  step: Step;
}
export function notifier(event: Event) {
  const { eventType } = event;
  const { route, step } = getEventPayload(
    event.swap,
    eventType,
    event.step ?? undefined
  );
  const fromAsset = `${step.fromBlockchain}.${step.fromSymbol}`;
  const toAsset = `${step.toBlockchain}.${step.toSymbol}`;
  const outputAmount = step.outputAmount ?? '';
  const currentFromBlockchain = !!event.step
    ? getCurrentBlockchainOfOrNull(event.swap, event.step)
    : null;
  let message = '';
  let messageSeverity: StepEvent['messageSeverity'] =
    RouteExecutionMessageSeverity.INFO;

  switch (eventType) {
    case StepEventTypes.STARTED:
      message = 'Swap process started';
      messageSeverity = RouteExecutionMessageSeverity.SUCCESS;
      break;
    case StepEventTypes.CREATE_TX:
      message = 'Please wait while the transaction is created ...';
      messageSeverity = RouteExecutionMessageSeverity.INFO;
      break;
    case StepEventTypes.SEND_TX:
      if (event.isApprovalTx)
        message = `Please confirm '${step.swapperName}' smart contract access to ${fromAsset}`;
      else message = 'Please confirm transaction request in your wallet';
      messageSeverity = RouteExecutionMessageSeverity.WARNING;
      break;
    case StepEventTypes.CHECK_TX:
      if (event.isApprovalTx)
        message = 'Checking approve transacation status ...';
      else message = 'Checking transacation status ...';
      messageSeverity = RouteExecutionMessageSeverity.INFO;
      break;
    case StepEventTypes.APPROVAL_TX_SUCCEEDED:
      message = 'Smart contract called successfully';
      messageSeverity = RouteExecutionMessageSeverity.SUCCESS;
      break;
    case StepEventTypes.OUTPUT_REVEALED:
      message = '';
      messageSeverity = RouteExecutionMessageSeverity.SUCCESS;
      break;
    case StepEventTypes.SUCCEEDED:
      message = `You received ${outputAmount} ${toAsset}, hooray!`;
      messageSeverity = RouteExecutionMessageSeverity.SUCCESS;
      break;
    case StepEventTypes.FAILED:
      message = `Swap failed: ${
        event.swap?.extraMessage ?? 'Reason is unknown'
      }`;
      messageSeverity = RouteExecutionMessageSeverity.ERROR;
      break;
    case StepEventTypes.CANCELED:
      message = 'Swap canceled!';
      messageSeverity = RouteExecutionMessageSeverity.ERROR;
      break;
    case StepEventTypes.WAITING_FOR_WALLET_CONNECT:
      message = 'Please connect your wallet.';
      messageSeverity = RouteExecutionMessageSeverity.WARNING;
      break;
    case StepEventTypes.WAITING_FOR_QUEUE:
      message = 'Waiting for other swaps to complete';
      messageSeverity = RouteExecutionMessageSeverity.WARNING;
      break;
    case StepEventTypes.WAITING_FOR_CHANGE_WALLET_ACCOUNT:
      message = 'Please change your wallet account.';
      messageSeverity = RouteExecutionMessageSeverity.WARNING;
      break;
    case StepEventTypes.WAITING_FOR_NETWORK_CHANGE:
      message = `Please change your wallet network to ${currentFromBlockchain}.`;
      messageSeverity = RouteExecutionMessageSeverity.WARNING;
      break;
    default:
      break;
  }

  emitRouteEvent({ event, message, messageSeverity, outputAmount, route });
  emitStepEvent({ event, message, messageSeverity, outputAmount, route, step });
}
