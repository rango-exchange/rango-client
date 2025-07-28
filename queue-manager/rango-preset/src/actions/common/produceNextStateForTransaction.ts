import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type {
  APIErrorCode,
  SignerErrorCode,
  StepStatus,
  SwapStatus,
} from 'rango-types';

import { Err, Ok, type Result } from 'ts-results';

import { DEFAULT_ERROR_CODE } from '../../constants';
import {
  getCurrentStep,
  getCurrentStepTx,
  getLastFinishedStepInput,
  getLastFinishedStepInputUsd,
  isApprovalCurrentStepTx,
  updateSwapStatus,
} from '../../helpers';
import { notifier } from '../../services/eventEmitter';
import { getRelatedWallet } from '../../shared';
import {
  StepEventType,
  StepExecutionEventStatus,
  type SwapActionTypes,
  type SwapQueueContext,
  type SwapStorage,
} from '../../types';

export interface NextTransactionState {
  nextStatus?: SwapStatus;
  nextStepStatus: StepStatus;

  message: string;
  details?: string;
}

export interface NextTransactionStateError extends NextTransactionState {
  errorCode: APIErrorCode | SignerErrorCode | null;
}

export function produceNextStateForTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Result<NextTransactionState, NextTransactionStateError> {
  const { getStorage, context } = actions;
  const { isMobileWallet } = context;
  const swap = getStorage().swapDetails;

  const currentStep = getCurrentStep(swap)!;

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const mobileWallet = isMobileWallet(sourceWallet?.walletType);
  const tx = getCurrentStepTx(currentStep);
  const isApproval = isApprovalCurrentStepTx(currentStep);

  if (!tx || !tx.type) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: tx is null!',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  const hasAlreadyProceededToSign =
    typeof swap.hasAlreadyProceededToSign === 'boolean';

  if (isApproval) {
    return new Ok({
      nextStatus: undefined,
      nextStepStatus: 'waitingForApproval',
      details:
        'Waiting for approve transaction to be mined and confirmed successfully',
      message: `Waiting for approval of ${currentStep?.fromSymbol} coin ${
        mobileWallet ? 'on your mobile phone!' : ''
      }`,
    });
  } else if (hasAlreadyProceededToSign) {
    return new Err({
      message: 'Transaction is expired. Please try again.',
      nextStepStatus: 'failed',
      nextStatus: 'failed',
      details: '',
      errorCode: 'TX_EXPIRED',
    });
  }

  return new Ok({
    message: 'Executing transaction ...',
    nextStepStatus: 'running',
    nextStatus: 'running',
    details: `${mobileWallet ? 'Check your mobile phone!' : ''}`,
  });
}

export function onNextStateError(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  error: NextTransactionStateError
) {
  const { getStorage, setStorage } = actions;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const isApproval = isApprovalCurrentStepTx(currentStep);

  const hasAlreadyProceededToSign =
    typeof swap.hasAlreadyProceededToSign === 'boolean';

  const updatedResult = updateSwapStatus({
    getStorage,
    setStorage,

    nextStepStatus: error.nextStepStatus,
    nextStatus: error.nextStatus,
    message: error.message,
    details: error.details,

    hasAlreadyProceededToSign: isApproval
      ? undefined
      : hasAlreadyProceededToSign,
    errorCode: hasAlreadyProceededToSign ? 'TX_EXPIRED' : undefined,
  });

  notifier({
    event: {
      type: StepEventType.FAILED,
      reason: error.message,
      reasonCode: updatedResult.failureType ?? DEFAULT_ERROR_CODE,
      inputAmount: getLastFinishedStepInput(swap),
      inputAmountUsd: getLastFinishedStepInputUsd(swap),
    },
    ...updatedResult,
  });
}

export function onNextStateOk(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  ok: NextTransactionState
) {
  const { getStorage, setStorage } = actions;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const isApproval = isApprovalCurrentStepTx(currentStep);

  const hasAlreadyProceededToSign =
    typeof swap.hasAlreadyProceededToSign === 'boolean';

  const updateResult = updateSwapStatus({
    getStorage,
    setStorage,
    nextStepStatus: ok.nextStepStatus,
    nextStatus: ok.nextStatus,
    message: ok.message,
    details: ok.details,
    hasAlreadyProceededToSign: isApproval
      ? undefined
      : hasAlreadyProceededToSign,
  });

  notifier({
    event: {
      type: StepEventType.TX_EXECUTION,
      status: StepExecutionEventStatus.SEND_TX,
    },
    ...updateResult,
  });
}
