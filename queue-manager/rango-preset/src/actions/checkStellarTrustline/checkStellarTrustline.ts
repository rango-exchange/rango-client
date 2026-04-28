import type { TargetToken } from './types';
import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { GenericSigner, StellarTransaction } from 'rango-types';
import type { Err } from 'ts-results';

import { TransactionType } from 'rango-types';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  updateStorageOnSuccessfulSign,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import { SwapActionTypes } from '../../types';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import {
  checkTrustLineAlreadyOpened,
  createTrustlineTransaction,
  ensureStellarNamespaceExists,
  ensureStellarTransactionIsValid,
} from './utils';

export async function checkStellarTrustline(
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

  const { failed, context, schedule, getStorage, next } = actions;
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
  const onSuccessfulFinish = () => {
    schedule(SwapActionTypes.EXECUTE_STELLAR_TRANSACTION);
    next();
    onFinish();
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
   * 3. Do we need open a trustline for this transaction?
   *
   * Trust line only should be opened for issued token (not native), server is putting that data as precondition for us.
   * If there is no need for that, we are skipping this step and consider it as done.
   */
  const trustlinePrecondition = transaction.val.preconditions.find(
    (item) => item.type === 'STELLAR_CHANGE_TRUSTLINE'
  );
  if (!trustlinePrecondition) {
    onSuccessfulFinish();
    return;
  }

  /*
   *
   * 4. Ensure trusline has been opened, then execute if needed.
   *
   */
  const chainId = meta.blockchains[transaction.val.blockChain]?.chainId;
  const walletSigners = await getSigners(sourceWallet.walletType);

  const token: TargetToken = {
    code: trustlinePrecondition.code,
    issuer: trustlinePrecondition.issuer,
  };

  // TODO: it's better to add some logic around `balance` to ensure we have enough capacity for the trust line. Now we only check it's already open or not.
  const isTrustLineAlreadyOpened = await checkTrustLineAlreadyOpened(
    trustlinePrecondition.wallet,
    token,
    {
      namespace: namespace.val,
    }
  );

  if (!isTrustLineAlreadyOpened) {
    const signer: GenericSigner<StellarTransaction> = walletSigners.getSigner(
      TransactionType.STELLAR
    );

    try {
      const trustlineTransaction: StellarTransaction =
        await createTrustlineTransaction(trustlinePrecondition.wallet, token);
      const result = await signer.signAndSendTx(
        trustlineTransaction,
        walletAddress,
        chainId
      );

      updateStorageOnSuccessfulSign(actions, result, {
        // TODO: approval has different meaning for EVM, we may need to add a third type called trustline for the following function.
        isApproval: true,
      });
      onSuccessfulFinish();
    } catch (e) {
      handleRejectedSign(actions)(e);
      onFinish();
    }
  } else {
    onSuccessfulFinish();
    return;
  }
}
