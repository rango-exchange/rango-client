import type { Context } from '@hub3js/core';

import { EIP1193_USER_REJECTED_REQUEST, getErrorMessage } from '@hub3js/core';

import {
  SLUSH_REJECTION_ERROR_NAME,
  SLUSH_REJECTION_MESSAGE,
} from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (
    error instanceof Error &&
    error.name === SLUSH_REJECTION_ERROR_NAME &&
    error.message === SLUSH_REJECTION_MESSAGE
  ) {
    return Object.assign(new Error(getErrorMessage(error), { cause: error }), {
      code: EIP1193_USER_REJECTED_REQUEST,
    });
  }
  return error;
}

export const suiHooks = { convertRejectionError };
