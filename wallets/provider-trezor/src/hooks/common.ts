import type { Context } from '@hub3js/core';
import type { ERRORS } from '@trezor/connect-web';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

// The user closed the popup, denied its permissions, or cancelled in the popup or on the device.
const TREZOR_REJECTION_CODES: ERRORS.ErrorCode[] = [
  'Method_Interrupted',
  'Method_PermissionsNotGranted',
  'Method_Cancel',
  'Failure_ActionCancelled',
  'Failure_PinCancelled',
];

function classifyTrezorConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      !TREZOR_REJECTION_CODES.some((code) => code === error.code)
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

export const commonHooks = { classifyTrezorConnectionError };
