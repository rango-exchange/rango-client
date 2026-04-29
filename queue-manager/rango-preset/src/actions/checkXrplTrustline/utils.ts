import type { TargetToken, XrplNamespace } from './types';
import type { SwapQueueContext } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { Transaction } from 'rango-sdk';
import type { XrplTransaction, XrplTrustSetTransactionData } from 'rango-types';
import type { Result } from 'ts-results';

import { isXrplTransaction } from 'rango-types';
import { Err, Ok } from 'ts-results';

export async function ensureXrplTransactionIsValid(
  tx: Transaction | null
): Promise<Result<XrplTransaction, NextTransactionStateError>> {
  if (!tx) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: tx is null!',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!isXrplTransaction(tx)) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message:
        "Unexpected Error: Expected XRPL transaction but it doesn't match with the structure.",
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (tx.data.TransactionType !== 'Payment') {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message:
        'Unexpected Error: We only support XRPL transactions with payment type',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  return Ok(tx);
}

export async function ensureXrplNamespaceExists(
  context: SwapQueueContext,
  walletType: string
): Promise<Result<XrplNamespace, NextTransactionStateError>> {
  // We need to work with namespace instance
  const provider = context.hubProvider(walletType);
  const xrplNamespace = provider.get('xrpl');
  if (!xrplNamespace) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'XRPL is not available on your wallet.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
  return Ok(xrplNamespace);
}

export async function checkTruslineAlreadyOpened(
  account: string,
  token: TargetToken,
  options: { namespace: XrplNamespace }
): Promise<boolean> {
  const lines = await options.namespace.accountLines(account, {
    peer: token.account,
  });
  return !!lines.some((trustline) => {
    return (
      trustline.currency === token.currency &&
      trustline.account === token.account &&
      trustline.limit !== '0'
    );
  });
}

export function createTrustlineTransaction(
  account: string,
  token: TargetToken
): XrplTrustSetTransactionData {
  return {
    TransactionType: 'TrustSet',
    Account: account,
    LimitAmount: {
      currency: token.currency,
      issuer: token.account,
      value: token.amount,
    },
  };
}
