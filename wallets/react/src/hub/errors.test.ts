import { Hub3Error } from '@hub3js/core';
import { error as logError } from '@rango-dev/logging-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reportConnectionFailure } from './errors.js';

vi.mock('@rango-dev/logging-core', () => ({
  error: vi.fn(),
}));

describe('reportConnectionFailure', () => {
  const options = {
    walletType: 'metamask',
    namespace: 'EVM',
    origin: 'manual',
  } as const;
  const context = {
    walletType: 'metamask',
    namespace: 'EVM',
    origin: 'manual',
  };

  beforeEach(() => {
    vi.mocked(logError).mockClear();
  });

  it.each(['PROVIDER_USER_REJECTED_REQUEST', 'PROVIDER_LOCKED'] as const)(
    'drop a %s error',
    (type) => {
      reportConnectionFailure(new Hub3Error(type, 'Declined'), options);

      expect(logError).not.toHaveBeenCalled();
    }
  );

  it('log a PROVIDER_UNEXPECTED error tagged only with its name, type, wallet, namespace and origin', () => {
    const error = new Hub3Error('PROVIDER_UNEXPECTED', 'Something went wrong', {
      cause: new Error('Something went wrong'),
    });

    reportConnectionFailure(error, options);

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: { name: 'Hub3Error', type: 'PROVIDER_UNEXPECTED', ...context },
    });
  });

  it('log a plain error with its name and no type', () => {
    const error = new TypeError('Something went wrong');

    reportConnectionFailure(error, options);

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: { name: 'TypeError', ...context },
    });
  });

  it.each([
    ['a string', 'Something went wrong', 'Something went wrong'],
    [
      "an object's own message",
      { code: 4001, message: 'rejected' },
      'rejected',
    ],
    [
      'the fixed message for an object without one',
      { code: 4001 },
      'Non-Error value thrown during connect.',
    ],
    [
      'the fixed message for anything else',
      undefined,
      'Non-Error value thrown during connect.',
    ],
  ])(
    'wrap a non-error as NonErrorThrown and log it, using %s',
    (_, value, message) => {
      reportConnectionFailure(value, options);

      expect(logError).toHaveBeenCalledOnce();
      const [logged, data] = vi.mocked(logError).mock.calls[0];
      expect(logged).toBeInstanceOf(Error);
      expect(logged.name).toBe('NonErrorThrown');
      expect(logged.message).toBe(message);
      expect(logged.cause).toBe(value);
      expect(data).toEqual({ tags: { name: 'NonErrorThrown', ...context } });
    }
  );
});
