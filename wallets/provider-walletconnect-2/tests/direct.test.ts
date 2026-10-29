import type { DirectConnectionUi } from '../src/types.js';
import type { ISignClient, SessionTypes } from '@walletconnect/types';

import { describe, expect, it, vi } from 'vitest';

import { connectDirectSession } from '../src/session/direct.js';

vi.mock('@rango-dev/logging-core', () => ({ debug: vi.fn() }));

const uri = 'wc:test-topic@2?relay-protocol=irn&symKey=test-only';
const session = {
  topic: 'test-session',
  pairingTopic: 'test-topic',
  namespaces: {},
} as SessionTypes.Struct;
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function fixture() {
  const approval = deferred<SessionTypes.Struct>();
  const closed = deferred<void>();
  const close = vi.fn();
  const display = vi.fn<DirectConnectionUi>(() => ({
    closed: closed.promise,
    close,
  }));
  const connect = vi
    .fn()
    .mockResolvedValue({ uri, approval: async () => approval.promise });
  const disconnect = vi.fn().mockResolvedValue(undefined);
  const client = { connect, disconnect } as unknown as ISignClient;
  const run = async (signal?: AbortSignal) =>
    connectDirectSession(client, {
      namespace: 'evm',
      chains: [{ namespace: 'eip155', reference: '1' }],
      display,
      signal,
    });
  return { approval, closed, close, display, connect, disconnect, client, run };
}

describe('direct wallet connection', () => {
  it('displays the supplied pairing uri and returns the approved session', async () => {
    const f = fixture();
    const result = f.run();
    await vi.waitFor(() => expect(f.display).toHaveBeenCalledWith(uri));
    f.approval.resolve(session);
    expect(await result).toBe(session);
    expect(f.close).toHaveBeenCalledOnce();
    expect(f.disconnect).not.toHaveBeenCalled();
    expect(f.connect.mock.calls[0][0].optionalNamespaces.eip155.chains).toEqual(
      ['eip155:1']
    );
  });
  it('cancels when the view closes and disconnects a late approval', async () => {
    const f = fixture();
    const result = f.run();
    const rejected = expect(result).rejects.toThrow('cancelled');
    await vi.waitFor(() => expect(f.display).toHaveBeenCalled());
    f.closed.resolve();
    await rejected;
    expect(f.disconnect).toHaveBeenCalledWith(
      expect.objectContaining({ topic: 'test-topic' })
    );
    f.approval.resolve(session);
    await vi.waitFor(() =>
      expect(f.disconnect).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'test-session' })
      )
    );
    expect(f.close).toHaveBeenCalledOnce();
  });
  it('does not start an already cancelled attempt', async () => {
    const f = fixture();
    const controller = new AbortController();
    controller.abort();
    await expect(f.run(controller.signal)).rejects.toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
    });
    expect(f.connect).not.toHaveBeenCalled();
  });
  it('discards a late uri when cancellation precedes connect resolution', async () => {
    const f = fixture();
    const pending = deferred<{
      uri: string;
      approval: () => Promise<SessionTypes.Struct>;
    }>();
    f.connect.mockReturnValue(pending.promise);
    const controller = new AbortController();
    const result = f.run(controller.signal);
    const rejected = expect(result).rejects.toThrow('cancelled');
    controller.abort();
    await rejected;
    pending.resolve({ uri, approval: async () => f.approval.promise });
    await vi.waitFor(() =>
      expect(f.disconnect).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'test-topic' })
      )
    );
    expect(f.display).not.toHaveBeenCalled();
    f.approval.resolve(session);
    await vi.waitFor(() =>
      expect(f.disconnect).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'test-session' })
      )
    );
  });
  it('closes and cleans up after wallet rejection', async () => {
    const f = fixture();
    const result = f.run();
    const rejected = expect(result).rejects.toThrow('User rejected');
    await vi.waitFor(() => expect(f.display).toHaveBeenCalled());
    f.approval.reject(new Error('User rejected'));
    await rejected;
    expect(f.close).toHaveBeenCalledOnce();
    expect(f.disconnect).toHaveBeenCalledWith(
      expect.objectContaining({ topic: 'test-topic' })
    );
  });
  it('cleans up an approval when rendering fails', async () => {
    const f = fixture();
    f.approval.resolve(session);
    f.display.mockImplementation(() => {
      throw new Error('render failed');
    });
    await expect(f.run()).rejects.toThrow('render failed');
    await vi.waitFor(() =>
      expect(f.disconnect).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'test-session' })
      )
    );
  });
  it('rejects a missing uri and cleans up late approval', async () => {
    const f = fixture();
    f.connect.mockResolvedValue({ approval: async () => f.approval.promise });
    await expect(f.run()).rejects.toThrow('No WalletConnect pairing URI');
    expect(f.display).not.toHaveBeenCalled();
    f.approval.resolve(session);
    await vi.waitFor(() =>
      expect(f.disconnect).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'test-session' })
      )
    );
  });
  it('does not let closing an old view cancel a new attempt', async () => {
    const first = fixture();
    const result = first.run();
    await vi.waitFor(() => expect(first.display).toHaveBeenCalled());
    first.approval.resolve(session);
    await result;
    const second = fixture();
    const next = second.run();
    first.closed.resolve();
    second.approval.resolve(session);
    expect(await next).toBe(session);
    expect(second.disconnect).not.toHaveBeenCalled();
  });
});
