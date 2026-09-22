import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

const LEDGER_LOCKED_DEVICE_STATUS_CODE = 0x5515;
const LEDGER_USER_CANCELLED_ERROR_NAME = 'TransportOpenUserCancelled';

// Reads the device status rather than the message `getLedgerError` flattens it into, and the error's name rather than `instanceof`.
function getLedgerConnectionErrorType(
  error: unknown
): ConnectionErrorType | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  if (
    'statusCode' in error &&
    error.statusCode === LEDGER_LOCKED_DEVICE_STATUS_CODE
  ) {
    return ConnectionErrorType.Locked;
  }
  if ('name' in error && error.name === LEDGER_USER_CANCELLED_ERROR_NAME) {
    return ConnectionErrorType.Rejected;
  }

  return undefined;
}

function classifyLedgerConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    const type = getLedgerConnectionErrorType(error);

    if (!type) {
      return error;
    }

    const [getState] = context.state();
    const { accounts, ...state } = getState();

    return new WalletConnectionError({
      walletType: WALLET_ID,
      namespace,
      type,
      state,
      cause: error,
    });
  };
}

export const commonHooks = { classifyLedgerConnectionError };
