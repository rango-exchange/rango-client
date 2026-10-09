import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { namespace } from './utxo.js';

const getAccounts = vi.fn();
const connect = vi.fn();

vi.mock('../utils.js', () => ({
  getInstanceOrThrow: () => ({
    zcash: { getAccounts, connect, on: vi.fn(), removeListener: vi.fn() },
  }),
}));

namespace.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return namespace.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('noir utxo connect', () => {
  beforeEach(() => {
    getAccounts.mockReset();
    connect.mockReset();
    getAccounts.mockResolvedValue(null);
  });

  it('throw a rejection with the wallet message for the recorded rejection', async () => {
    const rejection = new Error('User rejected the request');
    connect.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another message', async () => {
    const failure = new Error('User rejected the request.');
    connect.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'User rejected the request.',
      cause: failure,
    });
  });
});
