/* eslint-disable @typescript-eslint/no-magic-numbers */
import { WALLET_LOCKED_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { getLedgerConnectError, getLedgerError } from './utils.js';

function createLockedDeviceError() {
  return Object.assign(new Error('Ledger device: Locked device (0x5515)'), {
    name: 'LockedDeviceError',
    statusCode: 0x5515,
  });
}

describe('getLedgerConnectError', () => {
  it('attach the wallet locked code to a locked device and keep the message', () => {
    const error = getLedgerConnectError(createLockedDeviceError());

    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('message', 'The device is locked');
    expect(error).toHaveProperty('code', WALLET_LOCKED_ERROR_CODE);
  });

  it('map other device errors without a code', () => {
    const error = getLedgerConnectError({ statusCode: 0x6985 });

    expect(error).toHaveProperty('message', 'Action denied by user');
    expect(error).not.toHaveProperty('code');
  });

  it('return errors without a status code unchanged', () => {
    const error = new Error('Access denied to use Ledger device');

    expect(getLedgerConnectError(error)).toBe(error);
  });
});

describe('getLedgerError', () => {
  it('map a locked device without the wallet locked code', () => {
    const error = getLedgerError(createLockedDeviceError());

    expect(error).toHaveProperty('message', 'The device is locked');
    expect(error).not.toHaveProperty('code');
  });
});
