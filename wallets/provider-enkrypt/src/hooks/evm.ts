import type { Context } from '@hub3js/core';

import { Hub3Error } from '@hub3js/core';

import { ENKRYPT_REJECTION } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (error === ENKRYPT_REJECTION) {
    return new Hub3Error('PROVIDER_USER_REJECTED_REQUEST', error, {
      cause: error,
    });
  }
  return error;
}

export const evmHooks = { convertRejectionError };
