import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENKRYPT_REJECTION } from '../constants.js';

import { evm } from './evm.js';

const request = vi.fn();

vi.mock('../utils.js', () => ({
  evmEnkrypt: () => ({ request, on: vi.fn(), removeListener: vi.fn() }),
}));

evm.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return evm.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('enkrypt evm connect', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('throw a rejection for the recorded rejection string', async () => {
    request.mockRejectedValue(ENKRYPT_REJECTION);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: '',
    });
    expect((error as Hub3Error).cause).toMatchObject({
      cause: ENKRYPT_REJECTION,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Something went wrong');
    request.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Something went wrong',
      cause: failure,
    });
  });
});
