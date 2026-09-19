import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

const USER_REJECTION_MESSAGE = 'User rejected the request.';

/**
 * TronLink reports a rejected connect request only in the error message, so the
 * standard rejection code is attached here.
 */
function convertTronLinkRejectionError(
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

export const tronHooks = { convertTronLinkRejectionError };
