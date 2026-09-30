import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
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

  beforeEach(() => {
    vi.mocked(logError).mockClear();
  });

  it.each([ConnectionErrorType.Rejected, ConnectionErrorType.Locked])(
    'drop a %s connection error',
    (type) => {
      reportConnectionFailure(
        new WalletConnectionError(CONNECTION_ERROR_MESSAGES[type], { type }),
        options
      );

      expect(logError).not.toHaveBeenCalled();
    }
  );

  it('log an unknown connection error tagged only with its name, type, wallet, namespace and origin', () => {
    const error = new WalletConnectionError('Something went wrong', {
      type: ConnectionErrorType.Unknown,
      cause: new Error('Something went wrong'),
    });

    reportConnectionFailure(error, options);

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: {
        name: 'WalletConnectionError',
        type: ConnectionErrorType.Unknown,
        walletType: 'metamask',
        namespace: 'EVM',
        origin: 'manual',
      },
    });
  });

  it('drop a plain error', () => {
    reportConnectionFailure(new Error('Something went wrong'), options);

    expect(logError).not.toHaveBeenCalled();
  });

  it('drop a thrown value that is not an error', () => {
    reportConnectionFailure({ code: 4001, message: 'rejected' }, options);
    reportConnectionFailure('Something went wrong', options);

    expect(logError).not.toHaveBeenCalled();
  });
});
