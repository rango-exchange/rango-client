import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { namespace } from './namespace.js';

const getAddress = vi.fn();

vi.mock('@gemwallet/api', () => ({
  getAddress: async () => getAddress(),
  on: vi.fn(),
}));

namespace.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return namespace.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('gemwallet xrpl connect', () => {
  beforeEach(() => {
    getAddress.mockReset();
  });

  it('throw a rejection for a reject response', async () => {
    const response = { type: 'reject' };
    getAddress.mockResolvedValue(response);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User has rejected the request.',
      cause: response,
    });
  });

  it('throw an unexpected failure for a response without an address', async () => {
    getAddress.mockResolvedValue({ type: 'response', result: {} });

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: "Couldn't access to your wallet address.",
    });
  });
});
