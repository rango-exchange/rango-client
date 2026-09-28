import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { toTrezorConnectionFailure } from './utils.js';

describe('trezor connection failure', () => {
  it.each([
    ['Method_Interrupted', 'Popup closed'],
    ['Method_PermissionsNotGranted', 'Permissions not granted'],
    ['Method_Cancel', 'Cancelled'],
    ['Failure_ActionCancelled', 'Action cancelled by user'],
    ['Failure_PinCancelled', 'PIN entry cancelled'],
  ])('turn the %s code into a rejected connection error', (code, error) => {
    const payload = { error, code };

    const result = toTrezorConnectionFailure(payload);

    expect(result).toBeInstanceOf(WalletConnectionError);
    expect(result).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: error,
      cause: payload,
    });
  });

  it('turn a disconnected device into a plain error', () => {
    const result = toTrezorConnectionFailure({
      error: 'Device disconnected',
      code: 'Device_Disconnected',
    });

    expect(result).not.toBeInstanceOf(WalletConnectionError);
    expect(result.message).toBe('Device disconnected');
  });

  it('turn a payload without a code into a plain error', () => {
    const result = toTrezorConnectionFailure({ error: 'Cancelled' });

    expect(result).not.toBeInstanceOf(WalletConnectionError);
  });
});
