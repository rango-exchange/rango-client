import type { Context } from '@hub3js/core';

import { EIP1193_USER_REJECTED_REQUEST, getErrorMessage } from '@hub3js/core';

import { ENKRYPT_REJECTION } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (error === ENKRYPT_REJECTION) {
    return Object.assign(new Error(getErrorMessage(error), { cause: error }), {
      code: EIP1193_USER_REJECTED_REQUEST,
    });
  }
  return error;
}

export const evmHooks = { convertRejectionError };
