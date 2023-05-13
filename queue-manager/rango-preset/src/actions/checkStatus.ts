import { ExecuterActions } from '@rango-dev/queue-manager-core';
import {
  delay,
  getCurrentStep,
  isCosmosTransaction,
  isEvmTransaction,
  isSolanaTransaction,
  isStarknetTransaction,
  isTrasnferTransaction,
  isTronTransaction,
  resetNetworkStatus,
  updateSwapStatus,
} from '../helpers';
import { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import { getNextStep, MessageSeverity } from '../shared';
import { TransactionStatusResponse } from 'rango-sdk';
import { httpService } from '../services';

const INTERVAL_FOR_CHECK = 3_000;

/**
 * Subscribe to status of swap transaction by checking from server periodically.
 * After getting the status, notify the user and schedule `SCHEDULE_NEXT_STEP`.
 */
async function checkTransactionStatus({
  getStorage,
  setStorage,
  next,
  schedule,
  retry,
  failed,
  context,
}: ExecuterActions<
  SwapStorage,
  SwapActionTypes,
  SwapQueueContext
>): Promise<void> {
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  const txId = currentStep.executedTransactionId;

  let status: TransactionStatusResponse | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    status = await httpService().checkStatus({
      requestId: swap.requestId,
      txId: txId!,
      step: currentStep.id,
    });
  } catch (e) {
    await delay(INTERVAL_FOR_CHECK);
    retry();
    return;
  }

  // If user cancel swap during check status api call, we should ignore check status response
  if (currentStep?.status === 'failed') return;

  const outputAmount: string | null =
    status?.outputAmount ||
    (!!currentStep.outputAmount ? currentStep.outputAmount : null);
  const prevOutputAmount = currentStep.outputAmount || null;
  swap.extraMessage = status?.extraMessage || swap.extraMessage;
  swap.extraMessageSeverity = MessageSeverity.info;
  swap.extraMessageDetail = '';

  currentStep.status = status?.status || currentStep.status;
  currentStep.diagnosisUrl =
    status?.diagnosisUrl || currentStep.diagnosisUrl || null;
  currentStep.outputAmount = outputAmount || currentStep.outputAmount;
  currentStep.explorerUrl = status?.explorerUrl || currentStep.explorerUrl;
  currentStep.internalSteps = status?.steps || null;

  const newTransaction = status?.newTx;

  if (!!newTransaction) {
    currentStep.status = 'created';
    currentStep.executedTransactionId = null;
    currentStep.executedTransactionTime = null;
    currentStep.transferTransaction = null;
    currentStep.cosmosTransaction = null;
    currentStep.evmTransaction = null;
    currentStep.solanaTransaction = null;
    currentStep.evmApprovalTransaction = null;
    currentStep.starknetApprovalTransaction = null;
    currentStep.starknetTransaction = null;
    currentStep.tronApprovalTransaction = null;
    currentStep.tronTransaction = null;

    if (isEvmTransaction(newTransaction)) {
      if (newTransaction.isApprovalTx)
        currentStep.evmApprovalTransaction = newTransaction;
      else currentStep.evmTransaction = newTransaction;
    } else if (isCosmosTransaction(newTransaction)) {
      currentStep.cosmosTransaction = newTransaction;
    } else if (isSolanaTransaction(newTransaction)) {
      currentStep.solanaTransaction = newTransaction;
    } else if (isTrasnferTransaction(newTransaction)) {
      currentStep.transferTransaction = newTransaction;
    } else if (isStarknetTransaction(newTransaction)) {
      if (newTransaction.isApprovalTx)
        currentStep.starknetApprovalTransaction = newTransaction;
      else currentStep.starknetTransaction = newTransaction;
    } else if (isTronTransaction(newTransaction)) {
      if (newTransaction.isApprovalTx)
        currentStep.tronApprovalTransaction = newTransaction;
      else currentStep.tronTransaction = newTransaction;
    }
  }

  if (prevOutputAmount === null && outputAmount !== null)
    context.notifier({
      eventType: 'step_completed_with_output',
      swap: swap,
      step: currentStep,
    });
  else if (prevOutputAmount === null && outputAmount === null) {
    // it is needed to set notification after reloading the page
    context.notifier({
      eventType: 'check_tx_status',
      swap: swap,
      step: currentStep,
    });
  }

  if (currentStep.status === 'success') {
    const nextStep = getNextStep(swap, currentStep);
    swap.extraMessageDetail = '';
    swap.extraMessage = !!nextStep
      ? `starting next step: ${nextStep.swapperId}: ${nextStep.fromBlockchain} -> ${nextStep.toBlockchain}`
      : '';
  } else if (currentStep.status === 'failed') {
    swap.extraMessage = 'Transaction failed in blockchain';
    swap.extraMessageSeverity = MessageSeverity.error;
    swap.extraMessageDetail = status?.extraMessage || '';
    swap.status = 'failed';
    swap.finishTime = new Date().getTime().toString();
  }

  // Sync data with storage
  setStorage({ ...getStorage(), swapDetails: swap });

  if (status?.status === 'failed') {
    failed();
  } else if (
    status?.status === 'success' ||
    (status?.status === 'running' && !!status.newTx)
  ) {
    schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
    next();
  } else {
    await delay(INTERVAL_FOR_CHECK);
    retry();
  }
}

/**
 * Subscribe to status of approval transaction by checking from server periodically.
 * After getting the status, notify the user and schedule `SCHEDULE_NEXT_STEP`.
 */
async function checkApprovalStatus({
  getStorage,
  setStorage,
  next,
  schedule,
  retry,
  failed,
  context,
}: ExecuterActions<
  SwapStorage,
  SwapActionTypes,
  SwapQueueContext
>): Promise<void> {
  const swap = getStorage().swapDetails as SwapStorage['swapDetails'];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  let isApproved = false;
  try {
    const response = await httpService().checkApproval(
      swap.requestId,
      currentStep.executedTransactionId || ''
    );
    // If user cancel swap during check status api call, we should ignore check approval response
    if (currentStep?.status === 'failed') return;

    isApproved = response.isApproved;
    if (
      !isApproved &&
      (response.txStatus === 'failed' || response.txStatus === 'success')
    ) {
      let message, details;
      if (response.txStatus === 'failed') {
        message = 'Approve transaction failed';
        details = 'Smart contract approval failed in blockchain.';
      } else {
        message = 'Not enough approval';
        if (response.requiredApprovedAmount && response.currentApprovedAmount)
          details = `Required approval: ${response.requiredApprovedAmount}, current approval: ${response.currentApprovedAmount}`;
        else details = `You still don't have enough approval for this swap.`;
      }
      // approve transaction failed on
      // we should fail the whole swap
      const updateResult = updateSwapStatus({
        getStorage,
        setStorage,
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        errorCode: 'SEND_TX_FAILED',
        message: message,
        details: details,
      });
      context.notifier({
        eventType: 'smart_contract_call_failed', // TODO better event type
        ...updateResult,
      });
      failed();
    } else if (!isApproved) {
      // it is needed to set notification after reloading the page
      context.notifier({
        eventType: 'check_approve_tx_status',
        swap: swap,
        step: currentStep,
      });
    }
  } catch (e) {
    isApproved = false;
  }
  if (isApproved) {
    currentStep.status = 'approved';
    swap.extraMessage = `Spending ${currentStep.fromSymbol} approved successfully.`;
    swap.extraMessageDetail = null;
    swap.extraMessageSeverity = MessageSeverity.success;
    currentStep.evmApprovalTransaction = null;
    currentStep.executedTransactionId = null;
    currentStep.executedTransactionTime = null;
    currentStep.starknetApprovalTransaction = null;
    currentStep.tronApprovalTransaction = null;

    setStorage({
      ...getStorage(),
      swapDetails: swap,
    });

    context.notifier({
      eventType: 'contract_confirmed',
      swap: swap,
      step: currentStep,
    });

    schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
    next();
  } else {
    await delay(2000);
    retry();
  }
}

/**
 *
 * For doing a swap the user needs to accept a `contract` so it can use the user balance.
 * There is two types of check status:
 *  1. Checking approval transaction (Give permission to a contract)
 *  2. Checking swap transaction.
 *
 */
export async function checkStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const swap = actions.getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;

  // Reset network status
  // Because when check status is on `loading` or `failed` status, it shows previous message that isn't related to current state.
  resetNetworkStatus(actions);

  if (currentStep.status === 'running') {
    await checkTransactionStatus(actions);
  } else if (currentStep.status === 'waitingForApproval') {
    await checkApprovalStatus(actions);
  }
}
