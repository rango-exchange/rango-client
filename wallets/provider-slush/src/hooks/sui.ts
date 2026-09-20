import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

const USER_REJECTION_MESSAGE = 'User rejected the request.';

/**
 * Slush rejects a connect request with a TRPC error that has no top-level code,
 * so the rejection is recognised by its message.
 */
function convertSlushRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (error instanceof Error && error.message === USER_REJECTION_MESSAGE) {
    return Object.assign(new Error(error.message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}

export const suiHooks = { convertSlushRejectionError };
