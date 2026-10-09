/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Wallet } from '@mysten/wallet-standard';

import { createStore, Hub3Error } from '@hub3js/core';
import { getWallets, SUI_MAINNET_CHAIN } from '@mysten/wallet-standard';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';

import { sui } from './sui.js';

const standardConnect = vi.fn();

const unregister = getWallets().register({
  version: '1.0.0',
  name: WALLET_NAME_IN_WALLET_STANDARD,
  icon: 'data:image/svg+xml;base64,',
  chains: [SUI_MAINNET_CHAIN],
  accounts: [],
  features: {
    'standard:connect': { version: '1.0.0', connect: standardConnect },
  },
} as unknown as Wallet);

sui.store(createStore());

function createTrpcClientError(message: string) {
  const error = new Error(message);
  error.name = 'TRPCClientError';
  return Object.assign(error, { shape: { code: -32603, message } });
}

async function connectAndCatch(): Promise<unknown> {
  return sui.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('slush sui connect', () => {
  beforeEach(() => {
    standardConnect.mockReset();
  });

  afterAll(() => {
    unregister();
  });

  it('throw a rejection with the wallet message for the recorded rejection', async () => {
    const rejection = createTrpcClientError('User rejected the request.');
    standardConnect.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request.',
    });
    expect((error as Hub3Error).cause).toMatchObject({ cause: rejection });
  });

  it('throw an unexpected failure for another trpc error', async () => {
    const failure = createTrpcClientError('Internal server error');
    standardConnect.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Internal server error',
      cause: failure,
    });
  });

  it('throw an unexpected failure for the rejection text on a plain error', async () => {
    const failure = new Error('User rejected the request.');
    standardConnect.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      cause: failure,
    });
  });
});
