import type { Context } from '@hub3js/core';

import { Hub3Error } from '@hub3js/core';

import { IN_APP_BROWSER_REJECTION } from '../constants.js';

function convertRejectionError(_context: Context, error: unknown): unknown {
  if (error === IN_APP_BROWSER_REJECTION) {
    return new Hub3Error(
      'PROVIDER_USER_REJECTED_REQUEST',
      'You rejected the request',
      { cause: error }
    );
  }
  return error;
}

export const commonHooks = { convertRejectionError };
