import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { commonHooks } from './common.js';

const { convertLedgerRejectionError, convertLedgerDeviceError } = commonHooks;

function createTransportOpenUserCancelled(message: string) {
  return Object.assign(new Error(message), {
    name: 'TransportOpenUserCancelled',
  });
}

describe('convertLedgerRejectionError', () => {
  it('convert a dismissed device picker to a user rejection and keep the message', () => {
    const converted = convertLedgerRejectionError(
      undefined,
      createTransportOpenUserCancelled('Access denied to use Ledger device')
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty(
      'message',
      'Access denied to use Ledger device'
    );
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return a device access blocked by the browser unchanged', () => {
    const error = createTransportOpenUserCancelled(
      "Failed to execute 'requestDevice' on 'HID': Must be handling a user gesture to show a permission request."
    );

    expect(convertLedgerRejectionError(undefined, error)).toBe(error);
  });

  it('return the picker message under another error name unchanged', () => {
    const error = new Error('Access denied to use Ledger device');

    expect(convertLedgerRejectionError(undefined, error)).toBe(error);
  });
});

describe('convertLedgerDeviceError', () => {
  it('return the mapped device error instead of throwing it', () => {
    const error = convertLedgerDeviceError(undefined, { statusCode: 0x6985 });

    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('message', 'Action denied by user');
  });
});
