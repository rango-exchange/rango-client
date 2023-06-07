import mitt from 'mitt';
import {
  MainEvents,
  Route,
  RouteEvent,
  RouteExecutionEvents,
  Step,
  StepEvent,
  StepEventType,
} from '../types';
import { PendingSwap, PendingSwapStep, TransactionType } from 'rango-types/lib';
import { getCurrentBlockchainOfOrNull } from '../shared';

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
    } = swapStep;
    const step: Partial<Step> = {
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

    if (evmTransaction || evmApprovalTransaction) {
      step.transactionType = TransactionType.EVM;
      if (step.transactionType === TransactionType.EVM) {
        step.transaction = evmTransaction;
        step.approvalTransaction = evmApprovalTransaction;
        step.networkStatus = networkStatus;
      }
    } else if (tronTransaction || tronApprovalTransaction) {
      step.transactionType = TransactionType.TRON;
      if (step.transactionType === TransactionType.TRON) {
        step.transaction = tronTransaction;
        step.approvalTransaction = tronApprovalTransaction;
      }
    } else if (starknetTransaction || starknetApprovalTransaction) {
      step.transactionType = TransactionType.STARKNET;
      if (step.transactionType === TransactionType.STARKNET) {
        step.transaction = starknetTransaction;
        step.approvalTransaction = starknetApprovalTransaction;
      }
    } else if (cosmosTransaction) {
      step.transactionType = TransactionType.COSMOS;
      if (step.transactionType === TransactionType.COSMOS)
        step.transaction = cosmosTransaction;
    } else if (solanaTransaction) {
      step.transactionType = TransactionType.SOLANA;
      if (step.transactionType === TransactionType.SOLANA)
        step.transaction = solanaTransaction;
    } else if (transferTransaction) {
      step.transactionType = TransactionType.TRANSFER;
      if ((step.transactionType = TransactionType.TRANSFER))
        step.transaction = transferTransaction;
    } else step.transactionType = null;
    return step as Step;
  });
}

function getEventPayload(
  swap: PendingSwap,
  eventType: StepEventType,
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

type Event = {
  eventType: StepEvent['eventType'];
  swap: PendingSwap;
  step: PendingSwapStep | null;
  reason?: string;
  isApprovalTx?: boolean;
};

export const eventEmitter = mitt<RouteExecutionEvents>();

export function notifier(event: Event) {
  const { eventType } = event;
  const { route, step } = getEventPayload(
    event.swap,
    eventType,
    event.step || undefined
  );
  const fromAsset = `${step.fromBlockchain}.${step.fromSymbol}`;
  const toAsset = `${step.toBlockchain}.${step.toSymbol}`;
  const outputAmount = step.outputAmount || '';
  const currentFromBlockchain =
    !!event.swap && !!event.step
      ? getCurrentBlockchainOfOrNull(event.swap, event.step)
      : null;
  let message = '';
  let messageSeverity: StepEvent['messageSeverity'] = 'info';

  switch (eventType) {
    case 'started':
      message = 'Swap process started';
      messageSeverity = 'success';
      break;
    case 'create_tx':
      message = 'Please wait while the transaction is created ...';
      messageSeverity = 'info';
      break;
    case 'send_tx':
      if (event.isApprovalTx)
        message = `Please confirm '${step.swapperName}' smart contract access to ${fromAsset}`;
      else message = 'Please confirm transaction request in your wallet';
      messageSeverity = 'warning';
      break;
    case 'check_tx':
      if (event.isApprovalTx)
        message = 'Checking approve transacation status ...';
      else message = 'Checking transacation status ...';
      messageSeverity = 'info';
      break;
    case 'approval_tx_succeeded':
      message = 'Smart contract called successfully';
      messageSeverity = 'success';
      break;
    case 'output_revealed':
      message = '';
      messageSeverity = 'success';
      break;
    case 'succeeded':
      message = `You received ${outputAmount} ${toAsset}, hooray!`;
      messageSeverity = 'success';
      break;
    case 'failed':
      message = `Swap failed: ${
        event.swap?.extraMessage || 'Reason is unknown'
      }`;
      messageSeverity = 'error';
      break;
    case 'canceled':
      message = 'Swap canceled!';
      messageSeverity = 'error';
      break;
    case 'waiting_for_wallet_connect':
      message = 'Please connect your wallet.';
      messageSeverity = 'warning';
      break;
    case 'waiting_for_queue':
      message = 'Waiting for other swaps to complete';
      messageSeverity = 'warning';
      break;
    case 'waiting_for_change_wallet_account':
      message = 'Please change your wallet account.';
      messageSeverity = 'warning';
      break;
    case 'waiting_for_network_change':
      message = `Please change your wallet network to ${currentFromBlockchain}.`;
      messageSeverity = 'warning';
      break;
    default:
      break;
  }

  if (
    (eventType === 'started' && !event.step) ||
    eventType === 'failed' ||
    (eventType === 'succeeded' && !event.step)
  ) {
    const routeEvent = { eventType, message, messageSeverity } as RouteEvent;
    if (routeEvent.eventType === 'failed')
      routeEvent.reason = routeEvent.reason;
    if (routeEvent.eventType === 'succeeded')
      routeEvent.outputAmount = outputAmount;
    eventEmitter.emit(MainEvents.RouteEvent, {
      event: routeEvent,
      route,
    });
  }

  const stepEvent = { eventType, message, messageSeverity } as StepEvent;
  if (stepEvent.eventType === 'failed') stepEvent.reason = event.reason;

  if (stepEvent.eventType === 'succeeded')
    stepEvent.outputAmount = outputAmount;

  if (
    stepEvent.eventType === 'send_tx' ||
    stepEvent.eventType === 'tx_sent' ||
    stepEvent.eventType === 'check_tx'
  )
    stepEvent.isApprovalTx = !!event.isApprovalTx;

  if (
    (eventType === 'started' && !event.step) ||
    (eventType === 'succeeded' && !event.step)
  )
    return;
  eventEmitter.emit(MainEvents.StepEvent, { event: stepEvent, route, step });
}
