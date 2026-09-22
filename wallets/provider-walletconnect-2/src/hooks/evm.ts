import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { getSdkError } from '@walletconnect/utils';

import { WALLET_ID } from '../constants.js';

// The documented codes a wallet answers a session proposal with when the user rejects it.
const WALLETCONNECT_REJECTION_CODES = [
  getSdkError('USER_REJECTED').code,
  getSdkError('USER_REJECTED_METHODS').code,
];

function classifyWalletConnectConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      !WALLETCONNECT_REJECTION_CODES.some((code) => code === error.code)
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

export const evmHooks = { classifyWalletConnectConnectionError };
