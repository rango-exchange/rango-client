import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

const FREIGHTER_USER_REJECTION_CODE = -4;

export function convertFreighterRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === FREIGHTER_USER_REJECTION_CODE
  ) {
    const message =
      'message' in error && error.message !== undefined
        ? String(error.message)
        : undefined;
    return Object.assign(new Error(message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
