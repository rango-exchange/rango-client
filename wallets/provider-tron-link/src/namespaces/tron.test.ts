import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tron } from './tron.js';

const request = vi.fn();

vi.mock('../utils.js', () => ({
  tronTronlink: () => ({ request }),
}));

tron.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return tron.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('tronlink tron connect', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('throw a rejection with the wallet message for the recorded rejection', async () => {
    const rejection = new Error('User rejected the request.');
    request.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected the request.',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Internal JSON-RPC error.');
    request.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Internal JSON-RPC error.',
      cause: failure,
    });
  });
});
