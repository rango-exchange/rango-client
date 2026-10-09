/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { WalletConnectAdapter } from '../../adapter/adapter.js';

import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setAdapter } from '../../adapter/registry.js';

import { evm } from './namespace.js';

const ensureConnectedToChain = vi.fn();
const disconnectSession = vi.fn(async () => undefined);

evm.store(createStore());

async function connectAndCatch(): Promise<unknown> {
  return evm.connect().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('walletconnect evm connect', () => {
  beforeEach(() => {
    ensureConnectedToChain.mockReset();
    disconnectSession.mockClear();
    setAdapter({
      ensureConnectedToChain,
      disconnectSession,
      getClient: async () => ({ on: vi.fn(), off: vi.fn() }),
      getSession: vi.fn(),
    } as unknown as WalletConnectAdapter);
  });

  it.each([
    [5000, 'User rejected.'],
    [5002, 'User rejected methods.'],
  ])(
    'throw a rejection for the documented %s sdk error',
    async (code, message) => {
      const rejection = { code, message };
      ensureConnectedToChain.mockRejectedValue(rejection);

      const error = await connectAndCatch();

      expect(error).toBeInstanceOf(Hub3Error);
      expect(error).toMatchObject({
        type: 'PROVIDER_USER_REJECTED_REQUEST',
        message,
        cause: rejection,
      });
    }
  );

  it('throw a rejection for the recorded 4001 rejection', async () => {
    const rejection = {
      code: 4001,
      message: 'User disapproved requested methods',
    };
    ensureConnectedToChain.mockRejectedValue(rejection);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User disapproved requested methods',
      cause: rejection,
    });
  });

  it('classify another sdk error as unexpected', async () => {
    const failure = new Error('Unsupported chains.');
    ensureConnectedToChain.mockRejectedValue(failure);

    const error = await connectAndCatch();

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Unsupported chains.',
      cause: failure,
    });
    expect(disconnectSession).toHaveBeenCalledWith('evm');
  });

  it('disconnect the evm session when the user rejects connecting', async () => {
    ensureConnectedToChain.mockRejectedValue({
      code: 5000,
      message: 'User rejected.',
    });

    await connectAndCatch();

    expect(disconnectSession).toHaveBeenCalledWith('evm');
  });

  it('disconnect the evm session when connecting fails with another error', async () => {
    ensureConnectedToChain.mockRejectedValue(new Error('Unsupported chains.'));

    await connectAndCatch();

    expect(disconnectSession).toHaveBeenCalledWith('evm');
  });
});
