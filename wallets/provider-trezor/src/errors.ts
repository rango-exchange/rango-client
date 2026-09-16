import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

/*
 * Trezor codes of a user rejection. Trezor rewords its messages between versions,
 * so rejections are matched on these codes instead.
 */
const TREZOR_USER_REJECTION_CODES = [
  'Method_Interrupted',
  'Method_PermissionsNotGranted',
  'Method_Cancel',
  'Failure_ActionCancelled',
  'Failure_PinCancelled',
];

type TrezorFailurePayload = {
  error: string;
  code?: string;
};

/**
 * Creates the error a failed Trezor call throws while connecting. It keeps
 * Trezor's `code`, so `convertTrezorRejectionError` can recognise rejections.
 */
export function createTrezorConnectError(payload: TrezorFailurePayload): Error {
  const error = new Error(payload.error);
  if (payload.code) {
    return Object.assign(error, { code: payload.code });
  }
  return error;
}

export function convertTrezorRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    TREZOR_USER_REJECTION_CODES.includes(error.code)
  ) {
    return Object.assign(new Error(error.message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
