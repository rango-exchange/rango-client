import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IN_APP_BROWSER_REJECTION } from '../constants.js';

import { evm } from './evm.js';
import { solana } from './solana.js';

const evmRequest = vi.fn();
const solanaConnect = vi.fn();

vi.mock('../utils.js', () => {
  const listeners = {
    on: vi.fn(),
    off: vi.fn(),
    removeListener: vi.fn(),
  };
  return {
    evmTrustWallet: () => ({ request: evmRequest, ...listeners }),
    solanaTrustWallet: () => ({ connect: solanaConnect, ...listeners }),
  };
});

evm.store(createStore());
solana.store(createStore());

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('trust wallet connect', () => {
  beforeEach(() => {
    evmRequest.mockReset();
    solanaConnect.mockReset();
  });

  it('throw a rejection for the in-app browser rejection on evm', async () => {
    evmRequest.mockRejectedValue(IN_APP_BROWSER_REJECTION);

    const error = await catchError(async () => evm.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'You rejected the request',
    });
    expect((error as Hub3Error).cause).toMatchObject({
      cause: IN_APP_BROWSER_REJECTION,
    });
  });

  it('throw a rejection for the in-app browser rejection on solana', async () => {
    solanaConnect.mockRejectedValue(IN_APP_BROWSER_REJECTION);

    const error = await catchError(async () => solana.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'You rejected the request',
    });
    expect((error as Hub3Error).cause).toMatchObject({
      cause: IN_APP_BROWSER_REJECTION,
    });
  });

  it('throw an unexpected failure for another string', async () => {
    solanaConnect.mockRejectedValue('Something went wrong');

    const error = await catchError(async () => solana.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: '',
      cause: 'Something went wrong',
    });
  });
});
