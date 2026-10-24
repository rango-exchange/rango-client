import type { Context } from '@hub3js/core';

import { getErrorMessage, Hub3Error } from '@hub3js/core';

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
    return new Hub3Error(
      'PROVIDER_USER_REJECTED_REQUEST',
      getErrorMessage(error),
      { cause: error }
    );
  }
  return error;
}

export const suiHooks = { convertRejectionError };
