import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { GenericSigner, StellarTransaction } from 'rango-types';
import type { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  handleSuccessfulSign,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import {
  ensureStellarNamespaceExists,
  ensureStellarTransactionIsValid,
} from '../checkStellarTrustline';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

export async function executeStellarTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  /*
   *
   * 1. Ensure wallet is connected with a correct address.
   *
   */
  const checkResult = await checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  const { failed, getStorage, context } = actions;
  const { meta, getSigners } = context;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const currentTransactionFromStorage = getCurrentStepTx(currentStep);

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  /*
   * Checking the current transaction state to determine the next step.
   * It will either be Err, indicating process should stop, or Ok, indicating process should continue.
   */
  const nextStateResult = produceNextStateForTransaction(actions);

  if (nextStateResult.err) {
    handleErr(nextStateResult);
    return;
  }

  // On success, we should update Swap object and also call notifier
  onNextStateOk(actions, nextStateResult.val);

  /*
   *
   * 2. Ensure tx is supported, and namespace exists.
   *
   */
  const transaction = await ensureStellarTransactionIsValid(
    currentTransactionFromStorage
  );
  if (transaction.err) {
    handleErr(transaction);
    return;
  }

  const namespace = await ensureStellarNamespaceExists(
    context,
    sourceWallet.walletType
  );
  if (namespace.err) {
    handleErr(namespace);
    return;
  }

  /*
   *
   * 3. Execute transaction
   *
   */
  const chainId = meta.blockchains[transaction.val.blockChain]?.chainId;
  const walletSigners = await getSigners(sourceWallet.walletType);

  const signer: GenericSigner<StellarTransaction> = walletSigners.getSigner(
    transaction.val.type
  );

  try {
    const result = await signer.signAndSendTx(
      transaction.val,
      walletAddress,
      chainId
    );

    handleSuccessfulSign(actions, {
      isApproval: false,
    })(result);
  } catch (e) {
    handleRejectedSign(actions)(e);
  }

  // this works as `finally` for the iterator.
  onFinish();
}
