import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import {
  type GenericSigner,
  isXrplTransaction,
  type XrplTransaction,
  type XrplTrustSetTransactionData,
} from 'rango-types';

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

import { isIssuedCurrencyAmount } from './helpers';

export async function executeXrplTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const checkResult = await checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);

    return;
  }

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

  if (!isXrplTransaction(tx)) {
    throw new Error('TODO: NEEDS TO FAILED AND THROW A MESSAGE USING HOOKS');
  }

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  const chainId = meta.blockchains?.[tx.blockChain]?.chainId;
  const walletSigners = await getSigners(sourceWallet.walletType);

  if (tx.data.TransactionType !== 'Payment') {
    throw new Error('TODO: SHOULD FAILED Q correctly.');
  }

  const transactionQueue: XrplTransaction[] = [tx];
  if (isIssuedCurrencyAmount(tx.data.Amount)) {
    const trustlineTx: XrplTrustSetTransactionData = {
      TransactionType: 'TrustSet',
      Account: tx.data.Account,
      LimitAmount: {
        currency: tx.data.Amount.currency,
        issuer: tx.data.Amount.issuer,
        value: tx.data.Amount.value,
      },
    };
    transactionQueue.unshift({
      ...tx,
      data: trustlineTx,
    });
  }

  const signer: GenericSigner<XrplTransaction> = walletSigners.getSigner(
    tx.type
  );

  // TODO: Check failuire scenario
  for (const transaction of transactionQueue) {
    await signer
      .signAndSendTx(transaction, walletAddress, chainId)
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
}
