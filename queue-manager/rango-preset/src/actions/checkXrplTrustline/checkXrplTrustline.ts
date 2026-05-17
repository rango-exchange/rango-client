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

  const handlePrerequisiteMet = () => {
    schedule(SwapActionTypes.CHECK_PREREQUISITES);
    next();
    onFinish();
  };

  const handleScheduleCheckXrplTrustLineTransactionStatus = () => {
    schedule(SwapActionTypes.CHECK_XRPL_TRUSTLINE_TRANSACTION_STATUS);
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
   * 2. Check prerequisite status.
   *
   */
  let unmetXrplChangeTrustLineMeta: {
    prerequisite: XrplChangeTrustLinePrerequisite;
    prerequisiteIndex: number;
    prerequisiteResult: XrplChangeTrustLinePrerequisiteResult | undefined;
  } | null = null;

  const prerequisiteResults = currentStep.prerequisiteResults;

  for (
    let index = 0;
    index < (currentTransactionFromStorage.prerequisites?.length || 0);
    index++
  ) {
    const prerequisite = currentTransactionFromStorage.prerequisites[index];
    if (prerequisite.type === XRPL_CHANGE_TRUSTLINE_TYPE) {
      const prerequisiteResult = prerequisiteResults?.find(
        (
          prerequisiteResult
        ): prerequisiteResult is XrplChangeTrustLinePrerequisiteResult =>
          prerequisiteResult.prerequisiteIndex === index &&
          prerequisiteResult.prerequisiteType === prerequisite.type
      );

      if (prerequisiteResult?.status !== 'success') {
        unmetXrplChangeTrustLineMeta = {
          prerequisite,
          prerequisiteIndex: index,
          prerequisiteResult,
        };
        break;
      }
    }
  }

  if (!unmetXrplChangeTrustLineMeta) {
    handlePrerequisiteMet();
    return;
  }

  if (unmetXrplChangeTrustLineMeta.prerequisiteResult) {
    switch (unmetXrplChangeTrustLineMeta.prerequisiteResult.status) {
      case 'pending':
        handleScheduleCheckXrplTrustLineTransactionStatus();
        break;
      case 'failed':
        handleErr(
          new Err({
            nextStatus: 'failed',
            nextStepStatus: 'failed',
            message:
              'Unexpected Error: xrpl change trustline prerequisite failed!',
            details: undefined,
            errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
          })
        );
        break;
      case 'success':
        handlePrerequisiteMet();
        return;
      default:
        handleErr(
          new Err({
            nextStatus: 'failed',
            nextStepStatus: 'failed',
            message:
              'Unexpected Error: xrpl change trustline prerequisite result is not valid!',
            details: undefined,
            errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
          })
        );
    }
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
    // If the required limit is 0, the trust line is already opened
    handlePrerequisiteMet();
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

    const result = await signer.signAndSendTx(
      trustlineTransaction,
      xrplWallet.address,
      chainId
    );

    const prerequisiteResult: XrplChangeTrustLinePrerequisiteResult = {
      prerequisiteIndex: unmetXrplChangeTrustLineMeta.prerequisiteIndex,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'pending',
      data: {
        executedTransactionHash: result.hash,
      },
    };

    updateStorageWithPrerequisiteResult(actions, prerequisiteResult);
    handleScheduleCheckXrplTrustLineTransactionStatus();
  } catch (e) {
    handleRejectedSign(actions)(e);
    onFinish();
  }
}
