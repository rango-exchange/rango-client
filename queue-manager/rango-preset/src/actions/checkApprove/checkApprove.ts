import type {
  ApproveAdapter,
  ApproveCapableNamespaceId,
  ApprovePrerequisite,
} from './types';
import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { Transaction } from 'rango-sdk';
import type { GenericSigner } from 'rango-types';

import { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  resetNetworkStatus,
  updateStorageWithPrerequisiteResult,
  updateSwapStatus,
} from '../../helpers';
import { notifier } from '../../services/eventEmitter';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import {
  StepEventType,
  StepExecutionEventStatus,
  SwapActionTypes,
} from '../../types';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import { onNextStateError } from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import { isAllowanceSufficient, resolveApproveNamespace } from './utils';

/**
 * Generic approve-prerequisite action shared by every chain. It finds the unmet
 * approve prerequisite, checks the current allowance, and — when needed — builds
 * and signs the approve transaction. All chain-specific behavior lives in the
 * `approveAdapter`.
 */
export async function checkApprove<
  K extends ApproveCapableNamespaceId,
  TTransaction extends Transaction
>(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  approveAdapter: ApproveAdapter<K, TTransaction>
): Promise<void> {
  const { failed, context, schedule, getStorage, setStorage, next } = actions;
  const { meta, getSigners } = context;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const scheduleCheckPrerequisites = () => {
    schedule(SwapActionTypes.CHECK_PREREQUISITES);
    next();
    onFinish();
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  const storeSkipped = (prerequisiteIndex: number) => {
    updateStorageWithPrerequisiteResult(actions, {
      prerequisiteIndex,
      prerequisiteType: approveAdapter.prerequisiteType,
      status: 'skipped',
      data: null,
    });
  };

  /*
   *
   * 1. Ensure transaction is available.
   *
   */
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const currentTransactionFromStorage = getCurrentStepTx(currentStep);

  if (!currentTransactionFromStorage) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: tx is null!',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  /*
   *
   * 2. Find an approve prerequisite of this chain that has no result yet.
   *
   */
  let unmetApproveMeta: {
    prerequisite: ApprovePrerequisite;
    prerequisiteIndex: number;
  } | null = null;

  for (
    let prerequisiteIndex = 0;
    prerequisiteIndex < currentTransactionFromStorage.prerequisites.length;
    prerequisiteIndex++
  ) {
    const prerequisite =
      currentTransactionFromStorage.prerequisites[prerequisiteIndex];
    if (approveAdapter.isApprovePrerequisite(prerequisite)) {
      const prerequisiteResult = currentStep.prerequisiteResults?.find(
        (result) =>
          result.prerequisiteIndex === prerequisiteIndex &&
          result.prerequisiteType === approveAdapter.prerequisiteType
      );

      if (!prerequisiteResult) {
        unmetApproveMeta = { prerequisite, prerequisiteIndex };
      }
    }
  }

  if (!unmetApproveMeta) {
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 3. Ensure wallet is connected and is on the correct network.
   *
   */
  const checkResult = await checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  resetNetworkStatus(actions);

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const namespace = resolveApproveNamespace(
    context,
    sourceWallet.walletType,
    approveAdapter.namespaceKey
  );

  /*
   * Wallets that cannot execute approve prerequisites via namespace actions run
   * on the legacy approval flow: `createTransaction` requested
   * `validations.approve: true` for them, so the server has already ensured the
   * approval before returning this transaction — the prerequisite is met.
   */
  if (namespace.err) {
    storeSkipped(unmetApproveMeta.prerequisiteIndex);
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 4. Check if allowance is already sufficient.
   *
   */
  const allowanceResult = await isAllowanceSufficient(
    unmetApproveMeta.prerequisite,
    namespace.val
  );

  if (allowanceResult.err) {
    handleErr(allowanceResult);
    return;
  }

  if (allowanceResult.val.allowanceIsSufficient) {
    storeSkipped(unmetApproveMeta.prerequisiteIndex);
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 5. Build and sign the approve transaction.
   *
   */
  const approveTransactionResult = await approveAdapter.buildApproveTransaction(
    unmetApproveMeta.prerequisite,
    namespace.val
  );

  if (approveTransactionResult.err) {
    handleErr(approveTransactionResult);
    return;
  }

  try {
    const chainId =
      meta.blockchains[unmetApproveMeta.prerequisite.blockChain]?.chainId;
    const walletAddress = getCurrentAddressOf(swap, currentStep);
    const walletSigners = await getSigners(sourceWallet.walletType);
    const signer: GenericSigner<TTransaction> =
      walletSigners.getSigner<TTransaction>(approveAdapter.signerTxType);

    /*
     * Approving takes two waits, and telling them apart matters to the user: a
     * prompt is sitting in their wallet during the first, and nothing is asked
     * of them during the second. `StepStatus` has no separate signing state, so
     * both stay on `waitingForApproval` and the phases are distinguished by the
     * message and the emitted event.
     *
     * Phase 1 - waiting for the user to sign in their wallet.
     */
    const signingResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: undefined,
      nextStepStatus: 'waitingForApproval',
      message: `Waiting for approval of ${currentStep.fromSymbol} coin`,
      details: 'Please confirm the approve transaction in your wallet',
    });
    notifier({
      event: {
        type: StepEventType.TX_EXECUTION,
        status: StepExecutionEventStatus.SEND_TX,
      },
      ...signingResult,
      isApproval: true,
    });

    const transactionResult = await signer.signAndSendTx(
      approveTransactionResult.val,
      walletAddress,
      chainId
    );

    updateStorageWithPrerequisiteResult(actions, {
      prerequisiteIndex: unmetApproveMeta.prerequisiteIndex,
      prerequisiteType: approveAdapter.prerequisiteType,
      status: 'pending',
      data: {
        executedTransactionHash: transactionResult.hash,
      },
    });

    /*
     * Phase 2 - signed and broadcast, now waiting on the chain. Announced here
     * rather than in the status poller because the poller re-runs on every
     * interval, which would re-emit these events on each tick. This mirrors what
     * `setStepTransactionIds` does for the legacy approval flow.
     */
    const sentResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: undefined,
      nextStepStatus: 'waitingForApproval',
      message: `Waiting for approval of ${currentStep.fromSymbol} coin`,
      details:
        'Waiting for approve transaction to be mined and confirmed successfully',
    });
    notifier({
      event: {
        type: StepEventType.TX_EXECUTION,
        status: StepExecutionEventStatus.TX_SENT,
      },
      ...sentResult,
      isApproval: true,
    });
    notifier({
      event: { type: StepEventType.CHECK_STATUS },
      ...sentResult,
      isApproval: true,
    });

    scheduleCheckPrerequisites();
  } catch (e) {
    handleRejectedSign(actions)(e);
    onFinish();
  }
}
