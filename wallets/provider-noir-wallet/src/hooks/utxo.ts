import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

const NOIR_REJECTION_MESSAGE = 'User rejected the request';

function classifyNoirConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (!(error instanceof Error) || error.message !== NOIR_REJECTION_MESSAGE) {
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

export const utxoHooks = { classifyNoirConnectionError };
