import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { evm } from './evm.js';
import { utxo } from './utxo.js';

const ethereumGetAddress = vi.fn();
const getAddress = vi.fn();

vi.mock('@trezor/connect-web', () => ({
  default: {
    init: async () => undefined,
    ethereumGetAddress: async () => ethereumGetAddress(),
    getAddress: async () => getAddress(),
  },
}));

evm.store(createStore());
utxo.store(createStore());

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

const connectEvm = async () =>
  evm.connect(undefined, { derivationPath: "44'/60'/0'/0/0" });
const connectUtxo = async () =>
  utxo.connect({ derivationPath: "84'/0'/0'/0/0" });

describe.each([
  ['evm', connectEvm, ethereumGetAddress],
  ['utxo', connectUtxo, getAddress],
])('trezor %s connect', (_namespace, connect, getTrezorAddress) => {
  beforeEach(() => {
    getTrezorAddress.mockReset();
  });

  it.each([
    ['Method_Interrupted', 'Popup closed'],
    ['Method_PermissionsNotGranted', 'Permissions not granted'],
    ['Method_Cancel', 'Cancelled'],
    ['Failure_ActionCancelled', 'Action cancelled by user'],
    ['Failure_PinCancelled', 'PIN entry cancelled'],
  ])('throw a rejection for the %s code', async (code, message) => {
    const result = { success: false, payload: { error: message, code } };
    getTrezorAddress.mockResolvedValue(result);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message,
      cause: result.payload,
    });
  });

  it('throw an unexpected failure for a disconnected device', async () => {
    const result = {
      success: false,
      payload: { error: 'Device disconnected', code: 'Device_Disconnected' },
    };
    getTrezorAddress.mockResolvedValue(result);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Device disconnected',
      cause: result.payload,
    });
  });

  it('throw an unexpected failure for a result without a code', async () => {
    const result = { success: false, payload: { error: 'Cancelled' } };
    getTrezorAddress.mockResolvedValue(result);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Cancelled',
      cause: result.payload,
    });
  });

  it('throw an empty message for a result without error text', async () => {
    const result = {
      success: false,
      payload: { error: '', code: 'Method_Cancel' },
    };
    getTrezorAddress.mockResolvedValue(result);

    const error = await catchError(connect);

    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: '',
      cause: result.payload,
    });
  });
});
