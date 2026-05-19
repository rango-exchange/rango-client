import type { TargetToken } from './types';
import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type {
  GenericSigner,
  StellarChangeTrustLinePrerequisite,
  StellarChangeTrustLinePrerequisiteResult,
  StellarTransaction,
} from 'rango-types';

import { STELLAR_CHANGE_TRUSTLINE_TYPE, TransactionType } from 'rango-types';
import { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  updateStorageWithPrerequisiteResult,
} from '../../helpers';
import { SwapActionTypes } from '../../types';
import { onNextStateError } from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import {
  checkIfTrustLineIsAlreadyOpened,
  createTrustLineTransaction,
  ensureRequiredStellarWalletIsConnected,
  ensureStellarNamespaceExists,
  getStellarWalletFromSwap,
} from './utils';

export async function checkStellarTrustline(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, context, schedule, getStorage, next } = actions;
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
   * 2. Check if there is a prerequisite with STELLAR_CHANGE_TRUSTLINE_TYPE that does not have any result.
   *
   */
  let unmetStellarChangeTrustLineMeta: {
    prerequisite: StellarChangeTrustLinePrerequisite;
    prerequisiteIndex: number;
  } | null = null;

  for (
    let prerequisiteIndex = 0;
    prerequisiteIndex < currentTransactionFromStorage.prerequisites.length;
    prerequisiteIndex++
  ) {
    const prerequisite =
      currentTransactionFromStorage.prerequisites[prerequisiteIndex];
    if (prerequisite.type === STELLAR_CHANGE_TRUSTLINE_TYPE) {
      const prerequisiteResult = currentStep.prerequisiteResults.find(
        (
          prerequisiteResult
        ): prerequisiteResult is StellarChangeTrustLinePrerequisiteResult =>
          prerequisiteResult.prerequisiteIndex === prerequisiteIndex &&
          prerequisiteResult.prerequisiteType === STELLAR_CHANGE_TRUSTLINE_TYPE
      );

      if (!prerequisiteResult) {
        unmetStellarChangeTrustLineMeta = {
          prerequisite,
          prerequisiteIndex,
        };
        break;
      }
    }
  }

  if (!unmetStellarChangeTrustLineMeta) {
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 3. Ensure Stellar wallet is connected.
   *
   */

  const stellarWallet = getStellarWalletFromSwap(swap);
  if (!stellarWallet) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: Stellar wallet was not found in the swap!',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  const namespace = await ensureStellarNamespaceExists(
    context,
    stellarWallet.type
  );
  if (namespace.err) {
    handleErr(namespace);
    return;
  }

  const ensureRequiredStellarWalletIsConnectedResult =
    await ensureRequiredStellarWalletIsConnected(actions, stellarWallet);

  if (ensureRequiredStellarWalletIsConnectedResult.err) {
    requestBlockQueue(
      actions,
      ensureRequiredStellarWalletIsConnectedResult.val
    );
    return;
  }

  /*
   *
   * 3. Check if trust line is already opened.
   *
   */

  const token: TargetToken = {
    code: unmetStellarChangeTrustLineMeta.prerequisite.code,
    issuer: unmetStellarChangeTrustLineMeta.prerequisite.issuer,
    value: unmetStellarChangeTrustLineMeta.prerequisite.value,
  };

  const trustLineIsAlreadyOpenedResult = await checkIfTrustLineIsAlreadyOpened(
    unmetStellarChangeTrustLineMeta.prerequisite.wallet,
    token,
    {
      namespace: namespace.val,
    }
  );

  if (trustLineIsAlreadyOpenedResult.err) {
    handleErr(trustLineIsAlreadyOpenedResult);
    return;
  }

  if (trustLineIsAlreadyOpenedResult.val.trustLineIsAlreadyOpened) {
    const prerequisiteResult: StellarChangeTrustLinePrerequisiteResult = {
      prerequisiteIndex: unmetStellarChangeTrustLineMeta.prerequisiteIndex,
      prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
      status: 'skipped',
      data: null,
    };
    updateStorageWithPrerequisiteResult(actions, prerequisiteResult);
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 4. Create trust line transaction.
   *
   */

  try {
    // Create trust line transaction with the required limit
    const trustlineTransaction = await createTrustLineTransaction(
      unmetStellarChangeTrustLineMeta.prerequisite.wallet,
      token
    );

    const chainId = meta.blockchains['Stellar']?.chainId;
    const walletSigners = await getSigners(stellarWallet.type);
    const signer: GenericSigner<StellarTransaction> = walletSigners.getSigner(
      TransactionType.STELLAR
    );

    const transactionResult = await signer.signAndSendTx(
      trustlineTransaction,
      stellarWallet.address,
      chainId
    );

    const prerequisiteResult: StellarChangeTrustLinePrerequisiteResult = {
      prerequisiteIndex: unmetStellarChangeTrustLineMeta.prerequisiteIndex,
      prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
      status: 'success',
      data: {
        executedTransactionHash: transactionResult.hash,
      },
    };

    updateStorageWithPrerequisiteResult(actions, prerequisiteResult);
    scheduleCheckPrerequisites();
  } catch (e) {
    handleRejectedSign(actions)(e);
    onFinish();
  }
}
