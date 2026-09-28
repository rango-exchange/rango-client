import type { Context } from '@hub3js/core';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { evmHooks } from './evm.js';

const { reclassifyEnkryptConnectionError } = evmHooks;

const context = {} as Context;
const ENKRYPT_REJECTION =
  'User Rejected Request: The user rejected the request.';

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

describe('enkrypt evm connection error', () => {
  it('throw a rejected error with the fixed message for the recorded rejection string', () => {
    const error = createUnknownError(ENKRYPT_REJECTION);

    const thrown = catchThrown(() =>
      reclassifyEnkryptConnectionError(context, error)
    );

    expect(thrown).toBeInstanceOf(WalletConnectionError);
    expect(thrown).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      cause: ENKRYPT_REJECTION,
    });
  });

  it('rethrow an unknown error with another cause unchanged', () => {
    const error = createUnknownError('Something went wrong');

    expect(
      catchThrown(() => reclassifyEnkryptConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow an error already classified unchanged', () => {
    const error = new WalletConnectionError(
      CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Locked],
      { type: ConnectionErrorType.Locked, cause: ENKRYPT_REJECTION }
    );

    expect(
      catchThrown(() => reclassifyEnkryptConnectionError(context, error))
    ).toBe(error);
  });

  it('rethrow the raw rejection string unchanged', () => {
    expect(
      catchThrown(() =>
        reclassifyEnkryptConnectionError(context, ENKRYPT_REJECTION)
      )
    ).toBe(ENKRYPT_REJECTION);
  });
});
