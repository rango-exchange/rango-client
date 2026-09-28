import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { reportRangoError } from './reportRangoError';

vi.mock('@rango-dev/logging-core', () => ({
  error: vi.fn(),
}));

const mockedLogError = vi.mocked(logError);

const SINGLE_NAMESPACE = {
  walletConnection: { walletType: 'metamask', namespace: 'EVM' },
};
const NO_NAMESPACE = { walletConnection: { walletType: 'phantom' } };

function makeConnectionError(type: ConnectionErrorType) {
  return new WalletConnectionError('wallet failure', {
    type,
    cause: new Error('wallet failure'),
  });
}

describe('reportRangoError', () => {
  beforeEach(() => {
    mockedLogError.mockReset();
  });

  describe('a wallet connection error', () => {
    test('drop a rejected failure without logging anything', () => {
      reportRangoError(
        makeConnectionError(ConnectionErrorType.Rejected),
        SINGLE_NAMESPACE
      );

      expect(mockedLogError).not.toHaveBeenCalled();
    });

    test('drop a locked failure without logging anything', () => {
      reportRangoError(
        makeConnectionError(ConnectionErrorType.Locked),
        SINGLE_NAMESPACE
      );

      expect(mockedLogError).not.toHaveBeenCalled();
    });

    test('log an unknown failure once as the same error', () => {
      const error = makeConnectionError(ConnectionErrorType.Unknown);

      reportRangoError(error, SINGLE_NAMESPACE);

      expect(mockedLogError).toHaveBeenCalledTimes(1);
      expect(mockedLogError.mock.calls[0]?.[0]).toBe(error);
    });

    test('tag a single-namespace failure with exactly name, type, wallet type and namespace and no context', () => {
      reportRangoError(
        makeConnectionError(ConnectionErrorType.Unknown),
        SINGLE_NAMESPACE
      );

      expect(mockedLogError.mock.calls[0]?.[1]).toStrictEqual({
        tags: {
          name: 'WalletConnectionError',
          type: ConnectionErrorType.Unknown,
          walletType: 'metamask',
          namespace: 'EVM',
        },
      });
    });

    test('omit the namespace tag and any context when no namespace is given', () => {
      reportRangoError(
        makeConnectionError(ConnectionErrorType.Unknown),
        NO_NAMESPACE
      );

      expect(mockedLogError.mock.calls[0]?.[1]).toStrictEqual({
        tags: {
          name: 'WalletConnectionError',
          type: ConnectionErrorType.Unknown,
          walletType: 'phantom',
        },
      });
    });
  });

  describe('any other error', () => {
    test('log a plain error as the same object tagged only as unknown error', () => {
      const error = new Error('something broke');

      reportRangoError(error, SINGLE_NAMESPACE);

      expect(mockedLogError).toHaveBeenCalledTimes(1);
      expect(mockedLogError).toHaveBeenCalledWith(error, {
        tags: { name: 'UnknownError' },
      });
    });

    test('log an error carrying a rejection code instead of skipping it', () => {
      const error = Object.assign(new Error('User rejected'), { code: 4001 });

      reportRangoError(error, SINGLE_NAMESPACE);

      expect(mockedLogError).toHaveBeenCalledWith(error, {
        tags: { name: 'UnknownError' },
      });
    });

    test('wrap a thrown string using the string as its message', () => {
      reportRangoError('wallet exploded', SINGLE_NAMESPACE);

      const logged = mockedLogError.mock.calls[0]?.[0];
      expect(logged).toBeInstanceOf(Error);
      expect(logged?.message).toBe('wallet exploded');
      expect(logged?.cause).toBe('wallet exploded');
      expect(mockedLogError.mock.calls[0]?.[1]).toStrictEqual({
        tags: { name: 'UnknownError' },
      });
    });

    test('wrap an object with a message using its message', () => {
      const value = { code: -1, message: 'provider failure' };

      reportRangoError(value, SINGLE_NAMESPACE);

      const logged = mockedLogError.mock.calls[0]?.[0];
      expect(logged).toBeInstanceOf(Error);
      expect(logged?.message).toBe('provider failure');
      expect(logged?.cause).toBe(value);
    });

    test('wrap an object without a message as an unknown error', () => {
      const value = { code: -1 };

      reportRangoError(value, SINGLE_NAMESPACE);

      const logged = mockedLogError.mock.calls[0]?.[0];
      expect(logged).toBeInstanceOf(Error);
      expect(logged?.message).toBe('Unknown error');
      expect(logged?.cause).toBe(value);
    });
  });
});
