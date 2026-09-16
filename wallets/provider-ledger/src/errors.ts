import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

/*
 * The message Ledger's WebHID transport sets when the user dismisses the device
 * picker. The same error name with any other message means the browser blocked
 * access to the device.
 */
const DEVICE_PICKER_DISMISSED_MESSAGE = 'Access denied to use Ledger device';

export function convertLedgerRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    error instanceof Error &&
    error.name === 'TransportOpenUserCancelled' &&
    error.message === DEVICE_PICKER_DISMISSED_MESSAGE
  ) {
    return Object.assign(new Error(error.message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
