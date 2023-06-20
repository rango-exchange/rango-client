import mitt from 'mitt';
import {
  MainEvents,
  RemoveNameField,
  Route,
  RouteEvent,
  RouteEventType,
  RouteExecutionEvents,
  EventSeverity,
  Step,
  StepEvent,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
} from '../types';
import { PendingSwap, PendingSwapStep } from 'rango-types/lib';
import { getCurrentBlockchainOfOrNull } from '../shared';
import {
  getCurrentStepTx,
  getLastSuccessfulStep,
  isApprovalCurrentStepTx,
} from '../helpers';

type NotifierParams = {
  swap: PendingSwap;
  step: PendingSwapStep | null;
} & {
  event: RemoveNameField<StepEvent, 'message' | 'messageSeverity'>;
};

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
    } = swapStep;

    const step: Step = {
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
      transaction: getCurrentStepTx(swapStep),
    };

    return step;
  });
}

function getEventPayload(
  swap: PendingSwap,
  type: StepEventType | RouteEventType,
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
    if (type === 'failed') {
      const failedStep = routeSteps
        .slice()
        .reverse()
        .find((step) => step.status === 'failed');
      if (failedStep) result.step = failedStep;
    } else {
      const lastSuccessfulStep = getLastSuccessfulStep(routeSteps);
      if (lastSuccessfulStep) result.step = lastSuccessfulStep;
    }
  }

  return result;
}

export const eventEmitter = mitt<RouteExecutionEvents>();

function emitRouteEvent(stepEvent: StepEvent, route: Route, step: Step | null) {
  let routeEvent: RouteEvent | undefined;
  const { type } = stepEvent;
  switch (type) {
    case StepEventType.STARTED:
      if (!step) routeEvent = { ...stepEvent, type: RouteEventType.STARTED };
      break;
    case StepEventType.TX_EXECUTION:
      if (stepEvent.status === StepExecutionEventStatus.FAILED)
        routeEvent = { ...stepEvent, type: RouteEventType.FAILED };
      else if (stepEvent.status === StepExecutionEventStatus.SUCCEEDED)
        if (!step)
          routeEvent = { ...stepEvent, type: RouteEventType.SUCCEEDED };
      break;
    default:
      break;
  }
  if (routeEvent)
    eventEmitter.emit(MainEvents.RouteEvent, { event: routeEvent, route });
}

function emitStepEvent(stepEvent: StepEvent, route: Route, step: Step) {
  eventEmitter.emit(MainEvents.StepEvent, { event: stepEvent, route, step });
}

export function notifier(params: NotifierParams) {
  const { event } = params;
  const { type } = event;
  const { route, step } = getEventPayload(
    params.swap,
    type,
    params.step ?? undefined
  );
  const fromAsset = `${step.fromBlockchain}.${step.fromSymbol}`;
  const toAsset = `${step.toBlockchain}.${step.toSymbol}`;
  const outputAmount = step.outputAmount ?? '';
  const currentFromBlockchain = !!params.step
    ? getCurrentBlockchainOfOrNull(params.swap, params.step)
    : null;
  let message = '';
  let messageSeverity: StepEvent['messageSeverity'] = EventSeverity.INFO;

  switch (type) {
    case StepEventType.STARTED:
      message = 'Swap process started';
      messageSeverity = EventSeverity.SUCCESS;
      break;
    case StepEventType.TX_EXECUTION:
      if (event.status === StepExecutionEventStatus.CREATE_TX) {
        message = 'Please wait while the transaction is created ...';
        messageSeverity = EventSeverity.INFO;
      } else if (event.status === StepExecutionEventStatus.SEND_TX) {
        if (params.step && isApprovalCurrentStepTx(params.step))
          message = `Please confirm '${step.swapperName}' smart contract access to ${fromAsset}`;
        else message = 'Please confirm transaction request in your wallet';
        messageSeverity = EventSeverity.WARNING;
      } else if (event.status === StepExecutionEventStatus.TX_SENT) {
        message = 'Transaction sent successfully';
        messageSeverity = EventSeverity.INFO;
      } else if (event.status === StepExecutionEventStatus.SUCCEEDED) {
        message = `You received ${outputAmount} ${toAsset}, hooray!`;
        messageSeverity = EventSeverity.SUCCESS;
      } else if (event.status === StepExecutionEventStatus.FAILED) {
        message = `Swap failed: ${
          params.swap?.extraMessage ?? 'Reason is unknown'
        }`;
        messageSeverity = EventSeverity.ERROR;
      }
      break;
    case StepEventType.CHECK_STATUS:
      if (params.step && isApprovalCurrentStepTx(params.step))
        message = 'Checking approve transacation status ...';
      else message = 'Checking transacation status ...';
      messageSeverity = EventSeverity.INFO;
      break;
    case StepEventType.APPROVAL_TX_SUCCEEDED:
      message = 'Smart contract called successfully';
      messageSeverity = EventSeverity.SUCCESS;
      break;
    case StepEventType.OUTPUT_REVEALED:
      message = 'Transaction output amount revealed';
      messageSeverity = EventSeverity.SUCCESS;
      break;

    case StepEventType.TX_EXECUTION_BLOCKED:
      if (
        event.status ===
        StepExecutionBlockedEventStatus.WAITING_FOR_WALLET_CONNECT
      ) {
        message = 'Please connect your wallet.';
        messageSeverity = EventSeverity.WARNING;
      } else if (
        event.status === StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE
      ) {
        message = 'Waiting for other swaps to complete';
        messageSeverity = EventSeverity.WARNING;
      } else if (
        event.status ===
        StepExecutionBlockedEventStatus.WAITING_FOR_CHANGE_WALLET_ACCOUNT
      ) {
        message = 'Please change your wallet account.';
        messageSeverity = EventSeverity.WARNING;
      } else if (
        event.status ===
        StepExecutionBlockedEventStatus.WAITING_FOR_NETWORK_CHANGE
      ) {
        message = `Please change your wallet network to ${currentFromBlockchain}.`;
        messageSeverity = EventSeverity.WARNING;
      }
      break;

    default:
      break;
  }

  emitRouteEvent(
    { ...event, message, messageSeverity },
    route,
    params.step ? step : null
  );
  emitStepEvent({ ...event, message, messageSeverity }, route, step);
}
