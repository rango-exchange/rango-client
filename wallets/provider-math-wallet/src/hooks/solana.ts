import type { Context } from '@hub3js/core';

import { getErrorMessage, Hub3Error } from '@hub3js/core';

import { MATH_WALLET_REJECTION_MESSAGE } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (
    error instanceof Error &&
    error.message === MATH_WALLET_REJECTION_MESSAGE
  ) {
    return new Hub3Error(
      'PROVIDER_USER_REJECTED_REQUEST',
      getErrorMessage(error),
      { cause: error }
    );
  }
  return error;
}

export const solanaHooks = { convertRejectionError };
