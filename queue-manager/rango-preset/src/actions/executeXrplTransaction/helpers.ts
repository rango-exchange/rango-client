import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { Transaction } from 'rango-sdk';
import type { XrplTransaction } from 'rango-types';
import type { Result } from 'ts-results';

import { isXrplTransaction } from 'rango-types';
import { Err, Ok } from 'ts-results';

// Extracting currency and account from the following format (it's a convention on rango's backend): currency-accountAddress
export function extractFromSymbolAddress(
  symbolAddress: string
): [string, string | undefined] {
  const [currency, account] = symbolAddress.split('-');

  return [currency, account];
}

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
        'Unexpected Error: Only XRPL transactions with payment type are supported',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  return Ok(tx);
}
