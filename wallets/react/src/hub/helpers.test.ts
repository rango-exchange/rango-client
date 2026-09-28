import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { describe, expect, it, vi } from 'vitest';

import { createQueue, removeQueuedNamespacesOnRejection } from './helpers.js';

const WALLET = 'wallet';

function queueNamespaces(firstError: unknown) {
  const queueTask = createQueue({
    onError: removeQueuedNamespacesOnRejection,
  });
  const second = vi.fn(async () => 'second');
  const third = vi.fn(async () => 'third');

  const results = Promise.all([
    queueTask(async () => Promise.reject(firstError), WALLET),
    queueTask(second, WALLET),
    queueTask(third, WALLET),
  ]);

  return { results, second, third };
}

describe('connect queue', () => {
  it('abandon the queued namespaces after a rejected connection error', async () => {
    const error = new WalletConnectionError('User rejected the request.', {
      type: ConnectionErrorType.Rejected,
      cause: { code: 4001, message: 'User rejected the request.' },
    });

    const { results, second, third } = queueNamespaces(error);
    const [first, ...rest] = await results;

    expect(first.err && first.val).toBe(error);
    expect(rest.every((result) => result.err && result.val === error)).toBe(
      true
    );
    expect(second).not.toHaveBeenCalled();
    expect(third).not.toHaveBeenCalled();
  });

  it('abandon the queued namespaces after a rejection whose cause has no code', async () => {
    const error = new WalletConnectionError(
      CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      {
        type: ConnectionErrorType.Rejected,
        cause: 'User Rejected Request: The user rejected the request.',
      }
    );

    const { results, second, third } = queueNamespaces(error);
    await results;

    expect(second).not.toHaveBeenCalled();
    expect(third).not.toHaveBeenCalled();
  });

  it('keep the queued namespaces after an unknown connection error', async () => {
    const error = new WalletConnectionError('Something went wrong', {
      type: ConnectionErrorType.Unknown,
      cause: new Error('Something went wrong'),
    });

    const { results, second, third } = queueNamespaces(error);
    const [, secondResult, thirdResult] = await results;

    expect(second).toHaveBeenCalledOnce();
    expect(third).toHaveBeenCalledOnce();
    expect(secondResult.ok && secondResult.val).toBe('second');
    expect(thirdResult.ok && thirdResult.val).toBe('third');
  });

  it('keep the queued namespaces after a raw 4001 error', async () => {
    const { results, second } = queueNamespaces({
      code: 4001,
      message: 'User rejected the request.',
    });
    await results;

    expect(second).toHaveBeenCalledOnce();
  });
});
