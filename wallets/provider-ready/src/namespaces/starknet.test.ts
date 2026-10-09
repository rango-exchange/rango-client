import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { starknet } from './starknet.js';

const enable = vi.fn();

vi.mock('../utils.js', () => ({
  starknetReady: () => ({ enable, on: vi.fn(), off: vi.fn() }),
}));

starknet.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return starknet.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('ready starknet connect', () => {
  beforeEach(() => {
    enable.mockReset();
  });

  it('throw a rejection with the wallet message for the recorded rejection', async () => {
    const rejection = new Error('User aborted');
    enable.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User aborted',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Wallet not found');
    enable.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Wallet not found',
      cause: failure,
    });
  });
});
