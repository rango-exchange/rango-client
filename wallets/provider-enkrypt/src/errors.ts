import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

const USER_REJECTION_MESSAGE =
  'User Rejected Request: The user rejected the request.';

/**
 * Enkrypt throws a rejected connect request as a plain string, so it's turned
 * into an `Error` with the standard rejection code.
 */
export function convertEnkryptRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (error === USER_REJECTION_MESSAGE) {
    return Object.assign(new Error(error), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
