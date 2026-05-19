import type { TargetToken } from './types';
import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type {
  GenericSigner,
  XrplChangeTrustLinePrerequisite,
  XrplChangeTrustLinePrerequisiteResult,
  XrplTransaction,
} from 'rango-types';

import { TransactionType, XRPL_CHANGE_TRUSTLINE_TYPE } from 'rango-types';
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
  ensureRequiredXrplWalletIsConnected,
  ensureXrplNamespaceExists,
  getXrplWalletFromSwap,
} from './utils';

export async function checkXrplTrustline(
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
   * 2. Check if there is a prerequisite with XRPL_CHANGE_TRUSTLINE_TYPE that does not have any result.
   *
   */
  let unmetXrplChangeTrustLineMeta: {
    prerequisite: XrplChangeTrustLinePrerequisite;
    prerequisiteIndex: number;
  } | null = null;

  for (
    let prerequisiteIndex = 0;
    prerequisiteIndex < currentTransactionFromStorage.prerequisites.length;
    prerequisiteIndex++
  ) {
    const prerequisite =
      currentTransactionFromStorage.prerequisites[prerequisiteIndex];
    if (prerequisite.type === XRPL_CHANGE_TRUSTLINE_TYPE) {
      const prerequisiteResult = currentStep.prerequisiteResults?.find(
        (
          prerequisiteResult
        ): prerequisiteResult is XrplChangeTrustLinePrerequisiteResult =>
          prerequisiteResult.prerequisiteIndex === prerequisiteIndex &&
          prerequisiteResult.prerequisiteType === XRPL_CHANGE_TRUSTLINE_TYPE
      );

      if (!prerequisiteResult) {
        unmetXrplChangeTrustLineMeta = {
          prerequisite,
          prerequisiteIndex,
        };
      }
    }
  }

  if (!unmetXrplChangeTrustLineMeta) {
    scheduleCheckPrerequisites();
    return;
  }

  /*
   *
   * 3. Ensure XRPL wallet is connected.
   *
   */

  const xrplWallet = getXrplWalletFromSwap(swap);
  if (!xrplWallet) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: XRPL wallet was not found in the swap!',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }
  const namespace = await ensureXrplNamespaceExists(context, xrplWallet.type);
  if (namespace.err) {
    handleErr(namespace);
    return;
  }

  const ensureRequiredXrplWalletIsConnectedResult =
    await ensureRequiredXrplWalletIsConnected(actions, xrplWallet);

  if (ensureRequiredXrplWalletIsConnectedResult.err) {
    requestBlockQueue(actions, ensureRequiredXrplWalletIsConnectedResult.val);
    return;
  }

  /*
   *
   * 3. Check if trust line is already opened.
   *
   */

  const token: TargetToken = {
    currency: unmetXrplChangeTrustLineMeta.prerequisite.currency,
    account: unmetXrplChangeTrustLineMeta.prerequisite.issuer,
    amount: unmetXrplChangeTrustLineMeta.prerequisite.value,
  };

  const trustLineIsAlreadyOpenedResult = await checkIfTrustLineIsAlreadyOpened(
    unmetXrplChangeTrustLineMeta.prerequisite.wallet,
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
    const prerequisiteResult: XrplChangeTrustLinePrerequisiteResult = {
      prerequisiteIndex: unmetXrplChangeTrustLineMeta.prerequisiteIndex,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
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
    const trustlineTransaction = createTrustLineTransaction(
      unmetXrplChangeTrustLineMeta.prerequisite.wallet,
      token
    );

    const chainId = meta.blockchains['XRPL']?.chainId;
    const walletSigners = await getSigners(xrplWallet.type);
    const signer: GenericSigner<XrplTransaction> = walletSigners.getSigner(
      TransactionType.XRPL
    );

    const transactionResult = await signer.signAndSendTx(
      trustlineTransaction,
      xrplWallet.address,
      chainId
    );

    const prerequisiteResult: XrplChangeTrustLinePrerequisiteResult = {
      prerequisiteIndex: unmetXrplChangeTrustLineMeta.prerequisiteIndex,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'pending',
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
