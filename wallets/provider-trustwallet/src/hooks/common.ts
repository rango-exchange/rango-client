import type { Context } from '@hub3js/core';

import { EIP1193_USER_REJECTED_REQUEST } from '@hub3js/core';

import { IN_APP_BROWSER_REJECTION } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (error === IN_APP_BROWSER_REJECTION) {
    return Object.assign(
      new Error('You rejected the request', { cause: error }),
      {
        code: EIP1193_USER_REJECTED_REQUEST,
      }
    );
  }
  return error;
}

export const commonHooks = { convertRejectionError };
