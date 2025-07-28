import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleSuccessfulSign,
  handlRejectedSign,
  isApprovalCurrentStepTx,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

/**
 * Excecute a created transaction.
 *
 * This function implemented the parallel mode by `claim` mechanism which means
 * All the queues the meet certain situation (like multiple evm transaction) will go through
 * a `claim` mechanims that decides which queue should be run and it blocks other ones.
 *
 * A queue will be go to sign process, if the wallet and network is matched.
 */
export async function executeTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const checkResult = await checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  // All the conditions are met. We can safely send the tx to wallet for sign.
  const { failed, getStorage, context } = actions;
  const { meta, getSigners } = context;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const isApproval = isApprovalCurrentStepTx(currentStep);

  const onFinish = () => {
    // TODO resetClaimedBy is undefined here
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  /*
   * Checking the current transaction state to determine the next step.
   * It will either be Err, indicating process should stop, or Ok, indicating process should continu.
   */
  const nextStateResult = produceNextStateForTransaction(actions);

  if (nextStateResult.err) {
    onNextStateError(actions, nextStateResult.val);
    failed();
    onFinish();
    return;
  }

  // On sucess, we should update Swap object and also call notifier
  onNextStateOk(actions, nextStateResult.val);

  // when we are producing next step, it will check to tx shouldn't be null. So ! here is safe.
  const tx = getCurrentStepTx(currentStep)!;

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  const chainId = meta.blockchains?.[tx.blockChain]?.chainId;
  const walletSigners = await getSigners(sourceWallet.walletType);

  const signer = walletSigners.getSigner(tx.type);
  await signer
    .signAndSendTx(tx, walletAddress, chainId)
    .then(
      handleSuccessfulSign(actions, {
        isApproval,
      }),
      handlRejectedSign(actions)
    )
    .finally(() => {
      onFinish();
    });
}
