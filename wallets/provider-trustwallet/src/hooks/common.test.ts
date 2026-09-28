import type { Context } from '@hub3js/core';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { commonHooks } from './common.js';

const { reclassifyTrustWalletConnectionError } = commonHooks;

const context = {} as Context;

function createUnknownError(cause: unknown) {
  return new WalletConnectionError(
    CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Unknown],
    { type: ConnectionErrorType.Unknown, cause }
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

describe('trust wallet connection error', () => {
  it('throw a rejected error with the fixed message for the in-app browser cancelled string', () => {
    const error = createUnknownError('cancelled');

    const thrown = catchThrown(() =>
      reclassifyTrustWalletConnectionError(context, error)
    );

    expect(thrown).toBeInstanceOf(WalletConnectionError);
    expect(thrown).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      cause: 'cancelled',
    });
  });

  it('rethrow an unknown error with another cause unchanged', () => {
    const error = createUnknownError('Something went wrong');

    expect(
      catchThrown(() => reclassifyTrustWalletConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow an error carrying the cancelled text unchanged', () => {
    const error = createUnknownError(new Error('cancelled'));

    expect(
      catchThrown(() => reclassifyTrustWalletConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow the raw cancelled string unchanged', () => {
    expect(
      catchThrown(() =>
        reclassifyTrustWalletConnectionError(context, 'cancelled')
      )
    ).toBe('cancelled');
  });
});
