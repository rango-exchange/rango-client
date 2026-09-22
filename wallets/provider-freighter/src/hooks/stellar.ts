import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

// The code of Freighter's `FreighterApiDeclinedError`.
const FREIGHTER_DECLINED_ERROR_CODE = -4;

function classifyFreighterConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      error.code !== FREIGHTER_DECLINED_ERROR_CODE
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

export const stellarHooks = { classifyFreighterConnectionError };
