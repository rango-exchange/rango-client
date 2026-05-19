import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import {
  type GenericSigner,
  TransactionType,
  type XrplTransaction,
} from 'rango-types';
import { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  handleSuccessfulSign,
} from '../../helpers';
import { getCurrentAddressOf } from '../../shared';
import {
  ensureRequiredXrplWalletIsConnected,
  ensureXrplNamespaceExists,
  getXrplWalletFromSwap,
} from '../checkXrplTrustline';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import { ensureXrplTransactionIsValid } from './helpers';

export async function executeXrplTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, getStorage, context } = actions;
  const { meta, getSigners } = context;

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
   *
   * 1. Ensure transaction is available.
   *
   */
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const currentTransactionFromStorage = getCurrentStepTx(currentStep);

  const transaction = await ensureXrplTransactionIsValid(
    currentTransactionFromStorage
  );
  if (transaction.err) {
    handleErr(transaction);
    return;
  }

  /*
   *
   * 2. Ensure wallet is connected with a correct address.
   *
   */

  const xrplWallet = getXrplWalletFromSwap(swap);
  if (!xrplWallet) {
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

  const walletAddress = getCurrentAddressOf(swap, currentStep);

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
   * 3. Execute transaction
   *
   */
  const chainId = meta.blockchains['XRPL']?.chainId;
  let signer: GenericSigner<XrplTransaction>;
  try {
    const walletSigners = await getSigners(xrplWallet.type);
    signer = walletSigners.getSigner(TransactionType.XRPL);
  } catch {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message:
          'Unexpected Error: Failed to load the signer. Please refresh the page and try again.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  try {
    const result = await signer.signAndSendTx(
      transaction.val,
      walletAddress,
      chainId
    );

    handleSuccessfulSign(actions, {
      isApproval: transaction.val.data.TransactionType === 'TrustSet',
    })(result);
  } catch (e) {
    handleRejectedSign(actions)(e);
  }

  // this works as `finally` for the iterator.
  onFinish();
}
