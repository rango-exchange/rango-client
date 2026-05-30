import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { Transaction } from 'rango-sdk';
import type { StellarTransaction } from 'rango-types';
import type { Result } from 'ts-results';

import { isStellarTransaction } from 'rango-types';
import { Err, Ok } from 'ts-results';

// Extracting currency and account from the following format (it's a convention on rango's backend): currency-accountAddress
export function extractFromSymbolAddress(
  symbolAddress: string
): [string, string | undefined] {
  const [currency, account] = symbolAddress.split('-');

  return [currency, account];
}

export async function ensureStellarTransactionIsValid(
  tx: Transaction | null
): Promise<Result<StellarTransaction, NextTransactionStateError>> {
  if (!tx) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: tx is null!',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!isStellarTransaction(tx)) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message:
        "Unexpected Error: Expected Stellar transaction but it doesn't match with the structure.",
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  return Ok(tx);
}
