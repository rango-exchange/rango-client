import type { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type {
  GenericSigner,
  XrplTransaction,
  XrplTransactionDataIssuedCurrencyAmount,
  XrplTrustSetTransactionData,
} from 'rango-types';

import { isXrplTransaction } from 'rango-types';

import {
  checkTranasctionForExecute,
  getCurrentStep,
  handleSuccessfulSign,
  handlRejectedSign,
} from '../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../shared';

import { checkExecution } from './executeTransaction';

function isIssuedCurrencyAmount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amount: any
): amount is XrplTransactionDataIssuedCurrencyAmount {
  return (
    typeof amount === 'object' &&
    typeof amount.currency === 'string' &&
    typeof amount.issuer === 'string' &&
    typeof amount.value === 'string'
  );
}

export async function executeXrplTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const checkResult = await checkExecution(actions);

  if (checkResult) {
    await signTransaction(actions);
  }
}

export async function signTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const onFinish = () => {
    // TODO resetClaimedBy is undefined here
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  let tx: XrplTransaction;
  let isApproval: boolean;
  try {
    const result = await checkTranasctionForExecute(actions);
    if (isXrplTransaction(result.tx)) {
      tx = result.tx;
      isApproval = result.isApproval;
    } else {
      throw new Error('TODO: NEEDS TO FAILED AND THROW A MESSAGE USING HOOKS');
    }
  } catch {
    onFinish();
    // Avoid to run the rest of program.
    return;
  }

  const { getStorage, context } = actions;
  const { meta, getSigners } = context;
  const swap = getStorage().swapDetails;

  const currentStep = getCurrentStep(swap)!;

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
