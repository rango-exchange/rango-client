import type { ConnectionReportOptions } from './connectionReporting';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { reportConnectionError } from './connectionReporting';

vi.mock('@rango-dev/logging-core', () => ({ error: vi.fn() }));

const context: ConnectionReportOptions = {
  source: 'user',
};

const namespaceState = {
  network: null,
  connected: false,
  connecting: true,
  connectArgs: null,
};

function createConnectionError(type: ConnectionErrorType, cause?: unknown) {
  return new WalletConnectionError({
    walletType: 'phantom',
    namespace: 'solana',
    type,
    state: namespaceState,
    cause,
  });
}

function reportedEvent(call = 0) {
  const [error, data] = vi.mocked(logError).mock.calls[call] ?? [];

  return { error, data };
}

beforeEach(() => {
  vi.mocked(logError).mockReset();
});

describe('reporting a connection error', () => {
  test('drop a rejected connection failure without any event', () => {
    reportConnectionError(
      createConnectionError(ConnectionErrorType.Rejected),
      context
    );

    expect(logError).not.toHaveBeenCalled();
  });

  test('drop a locked wallet without any event', () => {
    reportConnectionError(
      createConnectionError(ConnectionErrorType.Locked),
      context
    );

    expect(logError).not.toHaveBeenCalled();
  });

  test('log an unknown connection failure once', () => {
    reportConnectionError(
      createConnectionError(ConnectionErrorType.Unknown),
      context
    );

    expect(logError).toHaveBeenCalledTimes(1);
  });

  test('log the error itself with its own tags and context', () => {
    const connectionError = createConnectionError(ConnectionErrorType.Unknown);

    reportConnectionError(connectionError, context);

    const { error, data } = reportedEvent();
    expect(error).toBe(connectionError);
    expect(data).toEqual({
      tags: {
        name: 'WalletConnectionError',
        type: 'unknown',
        source: 'user',
        walletType: 'phantom',
        namespace: 'solana',
      },
      context: {
        walletType: 'phantom',
        namespace: 'solana',
        state: namespaceState,
      },
    });
  });

  test('keep the wallet raw error as the cause of the event', () => {
    const walletError = { code: -32603, message: 'Internal error' };

    reportConnectionError(
      createConnectionError(ConnectionErrorType.Unknown, walletError),
      context
    );

    expect(reportedEvent().error).toHaveProperty('cause', walletError);
  });

  test('wrap an unexpected error keeping its real message', () => {
    const unexpected = new TypeError('Cannot read properties of undefined');

    reportConnectionError(unexpected, context);

    const { error, data } = reportedEvent();
    expect(error).toMatchObject({
      name: 'RangoError',
      type: 'unknown',
      message: 'Cannot read properties of undefined',
      cause: unexpected,
    });
    expect(data).toMatchObject({
      tags: {
        name: 'RangoError',
        type: 'unknown',
        source: 'user',
      },
    });
  });

  test('log a thrown non-error value as unknown error', () => {
    reportConnectionError('boom', context);

    expect(logError).toHaveBeenCalledTimes(1);
    expect(reportedEvent().error).toMatchObject({ message: 'Unknown error' });
  });
});
