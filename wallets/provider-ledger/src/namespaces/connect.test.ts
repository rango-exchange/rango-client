/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { evm } from './evm.js';
import { solana } from './solana.js';

const createTransport = vi.fn();

vi.mock('@ledgerhq/hw-transport-webhid', () => ({
  default: { create: async () => createTransport() },
}));

evm.store(createStore());
solana.store(createStore());

const options = { derivationPath: "44'/60'/0'/0/0" };

function createLedgerError(name: string, message: string, statusCode?: number) {
  const error = new Error(message);
  error.name = name;
  return Object.assign(error, statusCode === undefined ? {} : { statusCode });
}

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

const connectEvm = async () => evm.connect(undefined, options);
const connectSolana = async () => solana.connect(options);

describe.each([
  ['evm', connectEvm],
  ['solana', connectSolana],
])('ledger %s connect', (_namespace, connect) => {
  beforeEach(() => {
    createTransport.mockReset();
  });

  it('throw a rejection with the status message for a denied action', async () => {
    const rejection = createLedgerError(
      'TransportStatusError',
      'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)',
      0x6985
    );
    createTransport.mockRejectedValue(rejection);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'Action denied by user',
      cause: rejection,
    });
  });

  it('throw a locked error with the status message for a locked device', async () => {
    const locked = createLedgerError(
      'LockedDeviceError',
      'Ledger device: Locked device (0x5515)',
      0x5515
    );
    createTransport.mockRejectedValue(locked);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_LOCKED',
      message: 'The device is locked',
      cause: locked,
    });
  });

  it('throw a rejection with the wallet message for a cancelled device picker', async () => {
    const cancelled = createLedgerError(
      'TransportOpenUserCancelled',
      'Access denied to use Ledger device'
    );
    createTransport.mockRejectedValue(cancelled);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'Access denied to use Ledger device',
      cause: cancelled,
    });
  });

  it('throw an unexpected failure for another status', async () => {
    const failure = createLedgerError(
      'TransportStatusError',
      'Ledger device: UNKNOWN_ERROR (0x650f)',
      0x650f
    );
    createTransport.mockRejectedValue(failure);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Ledger device: UNKNOWN_ERROR (0x650f)',
      cause: failure,
    });
  });
});
