import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

const USER_REJECTION_MESSAGE = 'User closed the wallet popup.';

/**
 * Xverse reports a rejected connect request only in the error message, so the
 * standard rejection code is attached here.
 */
export function convertXverseRejectionError(
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
