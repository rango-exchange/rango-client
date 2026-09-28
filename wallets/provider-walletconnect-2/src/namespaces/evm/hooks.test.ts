import type { WalletConnectAdapter } from '../../adapter/adapter.js';
import type { Context } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setAdapter } from '../../adapter/registry.js';

import { disconnectSessionAndRethrow } from './hooks.js';

const context = {} as Context<EvmActions>;
const disconnectSession = vi.fn(async () => undefined);

function createRejectedError() {
  return new WalletConnectionError(
    CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
    { type: ConnectionErrorType.Rejected, cause: new Error('User rejected.') }
  );
}

function catchThrown(run: () => unknown): unknown {
  try {
    run();
  } catch (thrown) {
    return thrown;
  }
  return undefined;
}

describe('walletconnect evm connection failure hook', () => {
  beforeEach(() => {
    disconnectSession.mockClear();
    setAdapter({ disconnectSession } as unknown as WalletConnectAdapter);
  });

  it('rethrow the same error it was given instead of returning it', () => {
    const error = createRejectedError();

    const thrown = catchThrown(() =>
      disconnectSessionAndRethrow(context, error)
    );

    expect(thrown).toBe(error);
  });

  it('disconnect the evm session', () => {
    catchThrown(() =>
      disconnectSessionAndRethrow(context, createRejectedError())
    );

    expect(disconnectSession).toHaveBeenCalledWith('evm');
  });
});
