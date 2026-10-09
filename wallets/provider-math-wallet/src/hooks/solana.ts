import type { Context } from '@hub3js/core';

import { EIP1193_USER_REJECTED_REQUEST, getErrorMessage } from '@hub3js/core';

import { MATH_WALLET_REJECTION_MESSAGE } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (
    error instanceof Error &&
    error.message === MATH_WALLET_REJECTION_MESSAGE
  ) {
    return Object.assign(new Error(getErrorMessage(error), { cause: error }), {
      code: EIP1193_USER_REJECTED_REQUEST,
    });
  }
  return error;
}

export const solanaHooks = { convertRejectionError };
