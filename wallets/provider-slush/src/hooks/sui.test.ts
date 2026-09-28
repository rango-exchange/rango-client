/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Context } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { suiHooks } from './sui.js';

const { reclassifySlushConnectionError } = suiHooks;

const context = {} as Context;

function createTrpcClientError(message: string) {
  const error = new Error(message);
  error.name = 'TRPCClientError';
  return Object.assign(error, { shape: { code: -32603, message } });
}

function createUnknownError(cause: Error) {
  return new WalletConnectionError(cause.message, {
    type: ConnectionErrorType.Unknown,
    cause,
  });
}

function catchThrown(run: () => unknown): unknown {
  try {
    run();
  } catch (thrown) {
    return thrown;
  }
  return undefined;
}

describe('slush sui connection error', () => {
  it('throw a rejected error with the wallet message for the recorded rejection', () => {
    const rejection = createTrpcClientError('User rejected the request.');
    const error = createUnknownError(rejection);

    const thrown = catchThrown(() =>
      reclassifySlushConnectionError(context, error)
    );

    expect(thrown).toBeInstanceOf(WalletConnectionError);
    expect(thrown).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: 'User rejected the request.',
    });
    expect((thrown as WalletConnectionError).cause).toBe(rejection);
  });

  it('rethrow an unknown error with another message unchanged', () => {
    const error = createUnknownError(
      createTrpcClientError('Internal server error')
    );

    expect(
      catchThrown(() => reclassifySlushConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow an unknown error whose cause is not a trpc error unchanged', () => {
    const error = createUnknownError(new Error('User rejected the request.'));

    expect(
      catchThrown(() => reclassifySlushConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow an error that is not a connection error unchanged', () => {
    const error = createTrpcClientError('User rejected the request.');

    expect(
      catchThrown(() => reclassifySlushConnectionError(context, error))
    ).toBe(error);
  });
});
