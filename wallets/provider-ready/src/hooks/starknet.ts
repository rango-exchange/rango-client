import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

const READY_REJECTION_MESSAGE = 'User aborted';

function classifyReadyConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      !(error instanceof Error) ||
      error.message !== READY_REJECTION_MESSAGE
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

export const starknetHooks = { classifyReadyConnectionError };
