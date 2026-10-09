import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { utxo } from './utxo.js';

const request = vi.fn();

Object.assign(window, {
  XverseProviders: {
    BitcoinProvider: { request, addListener: vi.fn(() => vi.fn()) },
  },
});

utxo.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return utxo.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('xverse utxo connect', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('throw a rejection for the recorded thrown rejection', async () => {
    const rejection = new Error('User closed the wallet popup.');
    request.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User closed the wallet popup.',
      cause: rejection,
    });
  });

  it('throw a rejection for the rejection returned in the result', async () => {
    const result = {
      error: { code: '-32000', message: 'User closed the wallet popup.' },
    };
    request.mockResolvedValue(result);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User closed the wallet popup.',
      cause: result,
    });
  });

  it('throw an unexpected failure for another error returned in the result', async () => {
    const result = { error: { code: '-32603', message: 'Internal error' } };
    request.mockResolvedValue(result);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Internal error',
      cause: result,
    });
  });

  it('throw an unexpected failure for another thrown error', async () => {
    const failure = new Error('Wallet is not installed.');
    request.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Wallet is not installed.',
      cause: failure,
    });
  });
});
