import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

const XVERSE_REJECTION_MESSAGE = 'User closed the wallet popup.';

function classifyXverseConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      !(error instanceof Error) ||
      error.message !== XVERSE_REJECTION_MESSAGE
    ) {
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

export const utxoHooks = { classifyXverseConnectionError };
