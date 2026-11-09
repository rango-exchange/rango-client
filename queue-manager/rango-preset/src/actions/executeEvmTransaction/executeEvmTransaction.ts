import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { EvmTransaction } from 'rango-sdk';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  handleSuccessfulSign,
  isApprovalCurrentStepTx,
  resetNetworkStatus,
} from '../../helpers';
import { getCurrentAddressOf } from '../../shared';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import { checkEnvironmentBeforeExecuteEvmTransaction } from './checkEnvironmentBeforeExecuteEvmTransaction';
import { getEvmNamespaceOfStep, sendEvmTransaction } from './utils';

/**
 * Sends the current step's EVM transaction through the wallet's EVM namespace.
 *
 * Parallel swaps that share a wallet go through a `claim` mechanism, so only
 * one of them talks to the wallet at a time. The claim is released once the
 * wallet returns, and the transaction is then followed by the status check.
 */
export async function executeEvmTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const checkResult = await checkEnvironmentBeforeExecuteEvmTransaction(
    actions
  );
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  resetNetworkStatus(actions);

  const { failed, getStorage, context } = actions;
  const { meta } = context;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const isApproval = isApprovalCurrentStepTx(currentStep);

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const nextStateResult = produceNextStateForTransaction(actions);
  if (nextStateResult.err) {
    onNextStateError(actions, nextStateResult.val);
    failed();
    onFinish();
    return;
  }
  onNextStateOk(actions, nextStateResult.val);

  // `produceNextStateForTransaction` has checked the tx isn't null.
  const tx = getCurrentStepTx(currentStep) as EvmTransaction;
  const walletAddress = getCurrentAddressOf(swap, currentStep);
  const chainId = meta.blockchains?.[tx.blockChain]?.chainId ?? null;

  const namespace = getEvmNamespaceOfStep(context, swap, currentStep);
  if (!namespace) {
    handleRejectedSign(actions)(
      new Error('The EVM namespace is not available on your wallet.')
    );
    onFinish();
    return;
  }

  await sendEvmTransaction(namespace, tx, walletAddress, chainId)
    .then(
      handleSuccessfulSign(actions, { isApproval }),
      handleRejectedSign(actions)
    )
    .finally(onFinish);
}
