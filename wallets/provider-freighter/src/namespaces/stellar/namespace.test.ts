import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { namespace } from './namespace.js';

const requestAccess = vi.fn();

vi.mock('@stellar/freighter-api', () => ({
  requestAccess: async () => requestAccess(),
  WatchWalletChanges: class {
    watch = vi.fn();
    stop = vi.fn();
  },
}));

namespace.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return namespace.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('freighter stellar connect', () => {
  beforeEach(() => {
    requestAccess.mockReset();
  });

  it('throw a rejection for the recorded declined result', async () => {
    const declined = { code: -4, message: 'The user rejected this request.' };
    requestAccess.mockResolvedValue({ address: '', error: declined });

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'The user rejected this request.',
      cause: declined,
    });
  });

  it('throw a rejection for a thrown declined error', async () => {
    const declined = { code: -4, message: 'The user rejected this request.' };
    requestAccess.mockRejectedValue(declined);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'The user rejected this request.',
      cause: declined,
    });
  });

  it('throw an unexpected failure for another error result', async () => {
    const failure = { code: -1, message: 'The wallet encountered an error.' };
    requestAccess.mockResolvedValue({ address: '', error: failure });

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'The wallet encountered an error.',
      cause: failure,
    });
  });

  it('throw an empty message for an error result without one', async () => {
    requestAccess.mockResolvedValue({
      address: '',
      error: { code: -4, message: '' },
    });

    const error = await connectAndCatch();

    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: '',
    });
  });
});
