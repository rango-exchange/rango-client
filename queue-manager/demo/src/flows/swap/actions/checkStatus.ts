import BigNumber from 'bignumber.js';

import { checkApproved, checkSwapStatus, getNextStep } from '../../rango/helpers';
import { PendingSwap, MessageSeverity, SwapperStatusResponse } from '../../rango/types';
import { ExecuterActions } from '@rango-dev/queue-manager-core';
import {
  delay,
  getCurrentStep,
  isCosmosTransaction,
  isEvmTransaction,
  isSolanaTransaction,
  isTrasnferTransaction,
} from '../helpers';
import { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';

const DELAY_TIME = 3000;

async function checkTransactionStatus({
  getStorage,
  setStorage,
  next,
  schedule,
  retry,
  context,
}: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>) {
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  const txId = currentStep.executedTransactionId;

  let status: SwapperStatusResponse | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    status = await checkSwapStatus(swap.requestId, txId!, currentStep.id);
  } catch (e) {
    await delay(DELAY_TIME);
    retry();
  }

  const outputAmount: BigNumber | null =
    status?.outputAmount ||
    (!!currentStep.outputAmount ? new BigNumber(currentStep.outputAmount) : null);
  const prevOutputAmount = currentStep.outputAmount;
  swap.extraMessage = status?.extraMessage || swap.extraMessage;
  swap.extraMessageSeverity = MessageSeverity.info;
  swap.extraMessageDetail = '';

  currentStep.status = status?.status || currentStep.status;
  currentStep.diagnosisUrl = status?.diagnosisUrl || currentStep.diagnosisUrl || null;
  currentStep.outputAmount = outputAmount?.toFixed() || currentStep.outputAmount;
  currentStep.explorerUrl = status?.explorerUrl || currentStep.explorerUrl;
  currentStep.internalSteps = status?.steps || null;

  const newTransaction = status?.newTx;

  if (!!newTransaction) {
    currentStep.status = 'created';
    currentStep.executedTransactionId = null;
    currentStep.transferTransaction = null;
    currentStep.cosmosTransaction = null;
    currentStep.evmTransaction = null;
    currentStep.solanaTransaction = null;
    currentStep.evmApprovalTransaction = null;

    if (isEvmTransaction(newTransaction)) {
      if (newTransaction.isApprovalTx) currentStep.evmApprovalTransaction = newTransaction;
      else currentStep.evmTransaction = newTransaction;
    } else if (isCosmosTransaction(newTransaction)) {
      currentStep.cosmosTransaction = newTransaction;
    } else if (isSolanaTransaction(newTransaction)) {
      currentStep.solanaTransaction = newTransaction;
    } else if (isTrasnferTransaction(newTransaction)) {
      currentStep.transferTransaction = newTransaction;
    }
  }

  if (prevOutputAmount === null && outputAmount !== null)
    context.notifier({
      eventType: 'step_completed_with_output',
      swap: swap,
      step: currentStep,
    });

  if (currentStep.status === 'success') {
    const nextStep = getNextStep(swap, currentStep);
    swap.extraMessageDetail = '';
    swap.extraMessage = !!nextStep
      ? `starting next step: ${nextStep.swapperId}: ${nextStep.fromBlockchain} -> ${nextStep.toBlockchain}`
      : '';
  }

  setStorage({ ...getStorage(), swapDetails: swap });

  if (
    status?.status === 'failed' ||
    status?.status === 'success' ||
    (status?.status === 'running' && !!status.newTx)
  ) {
    schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
    next();
  } else {
    await delay(DELAY_TIME);
    retry();
  }
}

async function checkApprovalStatus({
  getStorage,
  setStorage,
  next,
  schedule,
  retry,
  context,
}: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>) {
  const swap = getStorage().swapDetails as PendingSwap;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  let isApproved = false;
  try {
    const response = await checkApproved(swap.requestId);
    isApproved = response.isApproved;
  } catch (e) {
    console.error('Failed to check getApprovedAmount', e);
    isApproved = false;
  }
  if (isApproved) {
    currentStep.status = 'approved';
    swap.extraMessage = `Spending ${currentStep.fromSymbol} approved successfully.`;
    swap.extraMessageDetail = null;
    swap.extraMessageSeverity = MessageSeverity.success;
    currentStep.evmApprovalTransaction = null;
    currentStep.executedTransactionId = null;

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
    await delay(DELAY_TIME);
    retry();
  }
}

export async function checkStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
) {
  console.log('%ccheck status...', 'color:#5fa425; background:white; font-size: 1.5rem');
  const swap = actions.getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  if (currentStep.status === 'running') {
    await checkTransactionStatus(actions);
  } else if (currentStep.status === 'waitingForApproval') {
    await checkApprovalStatus(actions);
  }
}
