import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

// Enkrypt rejects with a bare string, not an error object.
const ENKRYPT_REJECTION =
  'User Rejected Request: The user rejected the request.';

function classifyEnkryptConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (error !== ENKRYPT_REJECTION) {
      return error;
    }

    const [getState] = context.state();
    const { accounts, ...state } = getState();

    return new WalletConnectionError({
      walletType: WALLET_ID,
      namespace,
      type: ConnectionErrorType.Rejected,
      state,
      cause: error,
    });
  };
}

export const evmHooks = { classifyEnkryptConnectionError };
