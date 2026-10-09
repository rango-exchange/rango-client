/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { evm } from './evm.js';
import { solana } from './solana.js';

const evmRequest = vi.fn();
const solanaConnect = vi.fn();

vi.mock('../utils.js', () => ({
  evmMathWallet: () => ({ request: evmRequest }),
  solanaMathWallet: () => ({ connect: solanaConnect }),
}));

evm.store(createStore());
solana.store(createStore());

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('math wallet solana connect', () => {
  beforeEach(() => {
    solanaConnect.mockReset();
  });

  it('throw a rejection with the wallet message for the identity rejection', async () => {
    const rejection = new Error('User rejected the provision of an Identity');
    solanaConnect.mockRejectedValue(rejection);

    const error = await catchError(async () => solana.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the provision of an Identity',
    });
    expect((error as Hub3Error).cause).toMatchObject({ cause: rejection });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Wallet is locked');
    solanaConnect.mockRejectedValue(failure);

    const error = await catchError(async () => solana.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Wallet is locked',
      cause: failure,
    });
  });
});

describe('math wallet evm connect', () => {
  beforeEach(() => {
    evmRequest.mockReset();
  });

  it('throw a rejection for a 4001 error', async () => {
    const rejection = { code: 4001, message: 'User rejected the request.' };
    evmRequest.mockRejectedValue(rejection);

    const error = await catchError(async () => evm.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request.',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = { code: -32603, message: 'Internal error' };
    evmRequest.mockRejectedValue(failure);

    const error = await catchError(async () => evm.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Internal error',
      cause: failure,
    });
  });
});
