import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tron } from './tron.js';
import { utxo } from './utxo.js';

const requestAccounts = vi.fn();
const tronRequest = vi.fn();

vi.mock('../utils.js', async (importOriginal) => {
  const listeners = {
    on: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    utxoBitget: () => ({ requestAccounts, ...listeners }),
    tronBitget: () => ({ request: tronRequest, ...listeners }),
  };
});

utxo.store(createStore());
tron.store(createStore());

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('bitget utxo connect', () => {
  beforeEach(() => {
    requestAccounts.mockReset();
  });

  it('throw a rejection for the recorded -32603 rejection', async () => {
    const rejection = { code: -32603, message: 'User rejected the request' };
    requestAccounts.mockRejectedValue(rejection);

    const error = await catchError(async () => utxo.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for an internal error with another message', async () => {
    const failure = { code: -32603, message: 'Internal error' };
    requestAccounts.mockRejectedValue(failure);

    const error = await catchError(async () => utxo.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Internal error',
      cause: failure,
    });
  });
});

describe('bitget tron connect', () => {
  beforeEach(() => {
    tronRequest.mockReset();
  });

  it('throw an unexpected failure for a result code other than 200', async () => {
    const result = { code: 4000, message: 'Request failed' };
    tronRequest.mockResolvedValue(result);

    const error = await catchError(async () => tron.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Request failed',
      cause: result,
    });
  });
});
