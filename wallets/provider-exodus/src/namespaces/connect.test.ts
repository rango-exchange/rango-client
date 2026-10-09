/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { evm } from './evm.js';
import { solana } from './solana.js';

const evmRequest = vi.fn();
const solanaConnect = vi.fn();

vi.mock('../utils.js', () => ({
  evmExodus: () => ({ request: evmRequest }),
  solanaExodus: () => ({ connect: solanaConnect }),
}));

evm.store(createStore());
solana.store(createStore());

function createExodusRejection() {
  const error = new Error('The user rejected the request through the wallet.');
  error.name = 'UserRejectedRequestError';
  return Object.assign(error, { code: 4001, data: {} });
}

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe.each([
  ['evm', async () => evm.connect(), evmRequest],
  ['solana', async () => solana.connect(), solanaConnect],
])('exodus %s connect', (_namespace, connect, walletCall) => {
  beforeEach(() => {
    walletCall.mockReset();
  });

  it('throw a rejection for the recorded rejection', async () => {
    const rejection = createExodusRejection();
    walletCall.mockRejectedValue(rejection);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'The user rejected the request through the wallet.',
      cause: rejection,
    });
  });

  it('throw an unexpected failure for another error', async () => {
    const failure = new Error('Something went wrong');
    walletCall.mockRejectedValue(failure);

    const error = await catchError(connect);

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Something went wrong',
      cause: failure,
    });
  });
});
