import {
  createStore,
  EIP1193_USER_REJECTED_REQUEST,
  Hub3Error,
} from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { solana } from './solana.js';

const standardConnect = vi.fn();

vi.mock('../utils.js', () => ({
  solanaMetamask: () => ({
    features: {
      'standard:connect': { connect: standardConnect },
      'standard:events': { on: vi.fn(() => vi.fn()) },
    },
  }),
}));

solana.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return solana.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('metamask solana connect', () => {
  beforeEach(() => {
    standardConnect.mockReset();
  });

  it('throw a rejection when the 4001 code is nested in the cause', async () => {
    const rejection = new Error('User rejected the request.', {
      cause: { code: EIP1193_USER_REJECTED_REQUEST },
    });
    standardConnect.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request.',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Wallet not found');
    standardConnect.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Wallet not found',
      cause: failure,
    });
  });
});
