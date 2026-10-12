import type { Context } from '@hub3js/core';

import { Hub3Error } from '@hub3js/core';

/*
 * OKX resolves `tron_requestAccounts` with a bare `{ code: 4001 }` when the
 * user rejects the request, so the rejection thrown by the connect action has
 * no message.
 */
function addRejectionMessage(_context: Context, error: unknown): unknown {
  if (
    error instanceof Hub3Error &&
    error.type === 'PROVIDER_USER_REJECTED_REQUEST' &&
    !error.message
  ) {
    error.message = 'You rejected the request';
  }
  return error;
}

export const tronHooks = { addRejectionMessage };
