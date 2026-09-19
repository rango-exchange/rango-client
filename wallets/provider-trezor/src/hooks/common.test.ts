import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { createTrezorConnectError } from '../errors.js';

import { commonHooks } from './common.js';

const { convertTrezorRejectionError } = commonHooks;

describe('convertTrezorRejectionError', () => {
  it.each([
    ['an interrupted method', 'Method_Interrupted', 'Popup closed'],
    [
      'ungranted permissions',
      'Method_PermissionsNotGranted',
      'Permissions not granted',
    ],
    ['a cancelled method', 'Method_Cancel', 'Canceled'],
    [
      'a cancelled action',
      'Failure_ActionCancelled',
      'Action cancelled by user',
    ],
    ['a cancelled pin entry', 'Failure_PinCancelled', 'PIN entry cancelled'],
  ])(
    'convert %s to a user rejection and keep the message',
    (_label, code, message) => {
      const converted = convertTrezorRejectionError(
        undefined,
        createTrezorConnectError({ error: message, code })
      );

      expect(converted).toBeInstanceOf(Error);
      expect(converted).toHaveProperty('message', message);
      expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
    }
  );

  it('return a disconnected device error unchanged', () => {
    const error = createTrezorConnectError({
      error: 'Device disconnected',
      code: 'Device_Disconnected',
    });

    expect(convertTrezorRejectionError(undefined, error)).toBe(error);
  });

  it('return an error without a trezor code unchanged', () => {
    const error = new Error('Cancelled');

    expect(convertTrezorRejectionError(undefined, error)).toBe(error);
  });
});
