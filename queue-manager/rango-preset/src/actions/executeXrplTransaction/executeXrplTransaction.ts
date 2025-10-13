import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type {
  GenericSigner,
  XrplTransaction,
  XrplTrustSetTransactionData,
} from 'rango-types';

import { isXrplTransaction } from 'rango-types';
import { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
  handleSuccessfulSign,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import { TRUST_LINE_AMOUNT } from './constants';
import { extractFromSymbolAddress } from './helpers';

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
  const onFinish = () => {
    // TODO resetClaimedBy is undefined here
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
   * It will either be Err, indicating process should stop, or Ok, indicating process should continu.
   */
  const nextStateResult = produceNextStateForTransaction(actions);
  const tx = getCurrentStepTx(currentStep);

  if (nextStateResult.err) {
    handleErr(nextStateResult);
    return;
  }

  // this is also checking in `produceNextStateForTransaction.` check it here again to be resiliant for future changes.
  if (!tx) {
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

  if (!isXrplTransaction(tx)) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message:
          "Unexpected Error: Expected XRPL transaction but it doesn't match with the structure.",
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  if (tx.data.TransactionType !== 'Payment') {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message:
          'Unexpected Error: We do support only XRPL tranasaction with Payment type',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  // On sucess, we should update Swap object and also call notifier
  onNextStateOk(actions, nextStateResult.val);

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  const chainId = meta.blockchains?.[tx.blockChain]?.chainId;
  const walletSigners = await getSigners(sourceWallet.walletType);

  const transactionQueue: XrplTransaction[] = [tx];

  // null means it's native token (xrpl).
  if (currentStep.toSymbolAddress) {
    const [currency, account] = extractFromSymbolAddress(
      currentStep.toSymbolAddress
    );
    if (!currency || !account) {
      handleErr(
        new Err({
          nextStatus: 'failed',
          nextStepStatus: 'failed',
          message: 'Unexpected token format for XRPL transaction.',
          details: undefined,
          errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
        })
      );
      return;
    }

    // We need to work with namespace instance
    const provider = context.hubProvider(sourceWallet.walletType);
    const xrplNamespace = provider.get('xrpl');
    if (!xrplNamespace) {
      handleErr(
        new Err({
          nextStatus: 'failed',
          nextStepStatus: 'failed',
          message: 'XRPL is not available on your wallet.',
          details: undefined,
          errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
        })
      );
      return;
    }

    // Check if a trust line exists or not and also have capacity or not, if not, open a new one.

    // TODO: it's better to add some logic around `balance` to ensure we have enough capacity for the trust line. Now we only check it's already open or not.
    const lines = await xrplNamespace.accountLines(sourceWallet.address, {
      peer: account,
    });
    const isTruslineAlreadyOpened = !!lines.find((trustline) => {
      return (
        trustline.currency === currency &&
        trustline.account === account &&
        trustline.limit !== '0'
      );
    });

    if (!isTruslineAlreadyOpened) {
      const trustlineTx: XrplTrustSetTransactionData = {
        TransactionType: 'TrustSet',
        Account: tx.data.Account,
        LimitAmount: {
          currency: currency,
          issuer: account,
          value: TRUST_LINE_AMOUNT,
        },
      };

      transactionQueue.unshift({
        ...tx,
        data: trustlineTx,
      });
    }
  }

  const signer: GenericSigner<XrplTransaction> = walletSigners.getSigner(
    tx.type
  );

  for (const transaction of transactionQueue) {
    try {
      const result = await signer.signAndSendTx(
        transaction,
        walletAddress,
        chainId
      );

      // TODO: approval has different meaning for EVM, we may need to add a third type called trustline for the following function.
      handleSuccessfulSign(actions, {
        isApproval: transaction.data.TransactionType === 'TrustSet',
      })(result);
    } catch (e) {
      handleRejectedSign(actions)(e);
      break;
    }
  }

  // this works as `finally` for the iterator.
  onFinish();
}
