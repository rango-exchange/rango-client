import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { SignerFactory } from 'rango-types';

import { TransactionType } from 'rango-types';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  handleSuccessfulSign,
  isApprovalCurrentStepTx,
  resetNetworkStatus,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';
import { executeEvmTransaction } from '../executeEvmTransaction';

/**
 * Executes a created transaction through the wallet's signer, for the chains
 * that don't have their own execute action. A queue goes to signing once the
 * required wallet is connected.
 */
export async function executeTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const currentStepTx = getCurrentStepTx(
    getCurrentStep(actions.getStorage().swapDetails)!
  );
  /*
   * EVM transactions have their own action. A swap stored by an older version
   * can still resume here with one, so it's handed over.
   */
  if (currentStepTx?.type === TransactionType.EVM) {
    return executeEvmTransaction(actions);
  }

  const checkResult = checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  resetNetworkStatus(actions);

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

  let walletSigners: SignerFactory;
  try {
    walletSigners = await getSigners(sourceWallet.walletType);
  } catch (error) {
    handleRejectedSign(actions)(error);
    onFinish();
    return;
  }

  const signer = walletSigners.getSigner(tx.type);
  await signer
    .signAndSendTx(tx, walletAddress, chainId)
    .then(
      handleSuccessfulSign(actions, {
        isApproval,
      }),
      handleRejectedSign(actions)
    )
    .finally(() => {
      onFinish();
    });
}
