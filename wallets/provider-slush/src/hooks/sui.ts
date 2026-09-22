import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

const SLUSH_REJECTION_MESSAGE = 'User rejected the request.';

function classifySlushConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      !(error instanceof Error) ||
      error.message !== SLUSH_REJECTION_MESSAGE
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

export const suiHooks = { classifySlushConnectionError };
