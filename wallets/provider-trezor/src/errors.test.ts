import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import {
  convertTrezorRejectionError,
  createTrezorConnectError,
} from './errors.js';

describe('createTrezorConnectError', () => {
  it('keep the trezor code alongside the message', () => {
    const error = createTrezorConnectError({
      error: 'Popup closed',
      code: 'Method_Interrupted',
    });

    expect(error.message).toBe('Popup closed');
    expect(error).toHaveProperty('code', 'Method_Interrupted');
  });

  it('leave the code out when trezor sends none', () => {
    const error = createTrezorConnectError({ error: 'Unknown failure' });

    expect(error.message).toBe('Unknown failure');
    expect(error).not.toHaveProperty('code');
  });
});

describe('convertTrezorRejectionError', () => {
  it.each([
    {
      label: 'an interrupted method',
      code: 'Method_Interrupted',
      message: 'Popup closed',
    },
    {
      label: 'ungranted permissions',
      code: 'Method_PermissionsNotGranted',
      message: 'Permissions not granted',
    },
    {
      label: 'a cancelled method',
      code: 'Method_Cancel',
      message: 'Canceled',
    },
    {
      label: 'a cancelled action',
      code: 'Failure_ActionCancelled',
      message: 'Action cancelled by user',
    },
    {
      label: 'a cancelled pin entry',
      code: 'Failure_PinCancelled',
      message: 'PIN entry cancelled',
    },
  ])(
    'convert $label to a user rejection and keep the message',
    ({ code, message }) => {
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
