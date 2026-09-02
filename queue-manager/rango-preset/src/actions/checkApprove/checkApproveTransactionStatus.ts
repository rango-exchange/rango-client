import type {
  ApproveAdapter,
  ApproveCapableNamespaceId,
  ExecutedApproveResult,
} from './types';
import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { Transaction } from 'rango-sdk';

import { MessageSeverity } from 'rango-types';
import { Err } from 'ts-results';

import {
  delay,
  getCurrentStep,
  getCurrentStepTx,
  updateStorageWithPrerequisiteResult,
} from '../../helpers';
import { notifier } from '../../services/eventEmitter';
import { getRelatedWallet } from '../../shared';
import { StepEventType, SwapActionTypes } from '../../types';
import { onNextStateError } from '../common/produceNextStateForTransaction';

import { INTERVAL_FOR_CHECK_APPROVE_TRANSACTION_STATUS } from './constants';
import { isAllowanceSufficient, resolveApproveNamespace } from './utils';

/**
 * Generic status poller for a submitted approve prerequisite. Waits for the
 * approve transaction to confirm, then re-checks the allowance before marking
 * the prerequisite met. All chain-specific behavior lives in the `adapter`.
 */
export async function checkApproveTransactionStatus<
  K extends ApproveCapableNamespaceId,
  TTransaction extends Transaction
>(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  approveAdapter: ApproveAdapter<K, TTransaction>
): Promise<void> {
  const { failed, getStorage, setStorage, retry, next, schedule, context } =
    actions;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const onSuccessfulFinish = () => {
    schedule(SwapActionTypes.CHECK_PREREQUISITES);
    next();
    onFinish();
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  const retryAfterDelay = async () => {
    await delay(INTERVAL_FOR_CHECK_APPROVE_TRANSACTION_STATUS);
    retry();
  };

  /*
   *
   * 1. Ensure a pending approve prerequisite result is available.
   *
   */
  let pendingApprovePrerequisiteResult: ExecutedApproveResult | null = null;

  for (const prerequisiteResult of currentStep.prerequisiteResults) {
    if (
      approveAdapter.isApprovePrerequisiteResult(prerequisiteResult) &&
      prerequisiteResult.status === 'pending'
    ) {
      pendingApprovePrerequisiteResult = prerequisiteResult;
      break;
    }
  }

  if (!pendingApprovePrerequisiteResult) {
    onSuccessfulFinish();
    return;
  }

  /*
   *
   * 2. Resolve the namespace and the original prerequisite (needed for the allowance re-check).
   *
   */
  const sourceWallet = getRelatedWallet(swap, currentStep);
  const namespace = resolveApproveNamespace(
    context,
    sourceWallet.walletType,
    approveAdapter.namespaceKey
  );
  if (namespace.err) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'The approve namespace is not available on your wallet.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  const transaction = getCurrentStepTx(currentStep);
  const prerequisite =
    transaction?.prerequisites[
      pendingApprovePrerequisiteResult.prerequisiteIndex
    ];

  if (!prerequisite || !approveAdapter.isApprovePrerequisite(prerequisite)) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: approve prerequisite was not found!',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  /*
   *
   * 3. Check the approve transaction status through the wallet.
   *
   */
  try {
    const status = await approveAdapter.getTransactionStatus(
      namespace.val,
      pendingApprovePrerequisiteResult.data.executedTransactionHash
    );

    if (status === 'pending') {
      // Transaction is not confirmed yet, we need to retry.
      await retryAfterDelay();
      return;
    }

    if (status === 'failed') {
      updateStorageWithPrerequisiteResult(actions, {
        ...pendingApprovePrerequisiteResult,
        status: 'failed',
      });
      handleErr(
        new Err({
          nextStatus: 'failed',
          nextStepStatus: 'failed',
          message: 'Approve transaction failed on chain.',
          details: undefined,
          errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
        })
      );
      return;
    }

    /*
     * The transaction is confirmed, but some wallets allow editing the approve
     * amount, so we should also make sure the new allowance is sufficient.
     */
    const allowanceResult = await isAllowanceSufficient(
      prerequisite,
      namespace.val
    );

    if (allowanceResult.err) {
      handleErr(allowanceResult);
      return;
    }

    if (!allowanceResult.val.allowanceIsSufficient) {
      updateStorageWithPrerequisiteResult(actions, {
        ...pendingApprovePrerequisiteResult,
        status: 'failed',
      });
      handleErr(
        new Err({
          nextStatus: 'failed',
          nextStepStatus: 'failed',
          message: 'Insufficient approve, please try again.',
          details: undefined,
          errorCode: 'INSUFFICIENT_APPROVE',
        })
      );
      return;
    }

    updateStorageWithPrerequisiteResult(actions, {
      ...pendingApprovePrerequisiteResult,
      status: 'success',
    });

    // UI parity with the legacy approval flow.
    const updatedSwap = getStorage().swapDetails;
    const updatedStep = getCurrentStep(updatedSwap)!;
    updatedStep.status = 'approved';
    updatedSwap.extraMessage = `Spending ${updatedStep.fromSymbol} approved successfully.`;
    updatedSwap.extraMessageDetail = null;
    updatedSwap.extraMessageSeverity = MessageSeverity.success;
    setStorage({ ...getStorage(), swapDetails: updatedSwap });

    notifier({
      event: { type: StepEventType.APPROVAL_TX_SUCCEEDED },
      swap: updatedSwap,
      step: updatedStep,
    });

    onSuccessfulFinish();
  } catch {
    await retryAfterDelay();
  }
}
