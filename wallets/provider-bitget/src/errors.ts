import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

/*
 * Bitget BTC rejects with the generic internal error code, so a rejection is only
 * recognised together with its message.
 */
const INTERNAL_ERROR_CODE = -32603;
const USER_REJECTION_MESSAGE = 'User rejected the request';

export function convertBitgetUtxoRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    error.code === INTERNAL_ERROR_CODE &&
    error.message === USER_REJECTION_MESSAGE
  ) {
    return Object.assign(new Error(USER_REJECTION_MESSAGE), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
