import type { SessionTypes } from '@walletconnect/types';
import type UniversalProvider from '@walletconnect/universal-provider';

import { describe, expect, it, vi } from 'vitest';

import { WalletConnectAdapter } from '../src/adapter/adapter.js';
import { createUniversalProvider } from '../src/adapter/provider-client.js';
import { createSessionSubscriber } from '../src/namespaces/subscriber.js';
import { buildOathProvider, oathConnectionLink } from '../src/oath.js';

vi.mock('../src/adapter/provider-client.js', () => ({
  createUniversalProvider: vi.fn(),
}));
vi.mock('@rango-dev/logging-core', () => ({ debug: vi.fn(), error: vi.fn() }));

const session = { topic: 'oath-session' } as SessionTypes.Struct;

describe('oath wallet isolation', () => {
  it('keeps concurrent clients and session caches separate from generic walletconnect', async () => {
    const genericClient = { name: 'generic' } as unknown as UniversalProvider;
    const oathClient = { name: 'oath' } as unknown as UniversalProvider;
    vi.mocked(createUniversalProvider).mockImplementation(async (_, prefix) =>
      prefix ? oathClient : genericClient
    );
    const generic = new WalletConnectAdapter({ projectId: 'test', meta: [] });
    const oath = new WalletConnectAdapter({
      projectId: 'test',
      storagePrefix: 'rango:oath',
      meta: [],
    });
    const clients = await Promise.all([
      generic.getUniversalProvider(),
      oath.getUniversalProvider(),
      oath.getUniversalProvider(),
    ]);
    expect(clients).toEqual([genericClient, oathClient, oathClient]);
    expect(createUniversalProvider).toHaveBeenCalledTimes(2);
    oath.cacheSession('evm', session);
    expect(generic.getSession('evm')).toBeNull();
    generic.clearAllSessions();
    expect(oath.getSession('evm')).toBe(session);
  });

  it('filters namespace events by client and topic and removes only its own listener', async () => {
    const listeners = new Map<string, (event: { topic: string }) => void>();
    const client = {
      on: vi.fn((name, handler) => listeners.set(name, handler)),
      off: vi.fn(),
    };
    const adapter = {
      getClient: async () => client,
      getSession: () => session,
    } as unknown as WalletConnectAdapter;
    const handle = vi.fn();
    const [subscribe, unsubscribe] = createSessionSubscriber(
      'evm',
      'session_delete',
      handle,
      () => adapter
    );
    const context = {} as Parameters<typeof subscribe>[0];
    await subscribe(context);
    const handler = listeners.get('session_delete')!;
    handler({ topic: 'generic-session' });
    expect(handle).not.toHaveBeenCalled();
    handler({ topic: 'oath-session' });
    expect(handle).toHaveBeenCalledOnce();
    unsubscribe(context, undefined);
    await vi.waitFor(() =>
      expect(client.off).toHaveBeenCalledWith('session_delete', handler)
    );
  });

  it('advertises only supported mainnet evm chains and has independent namespace instances', () => {
    const first = buildOathProvider();
    const second = buildOathProvider();
    expect(first.id).toBe('oath-wallet');
    expect(first.get('evm') === second.get('evm')).toBe(false);
    const property = first
      .info()!
      .metadata.properties!.find((item) => item.name === 'namespaces')!;
    if (property.name !== 'namespaces') {
      throw new Error('missing namespace metadata');
    }
    const supports = property.value.data[0].isChainSupported;
    expect(supports('eip155:1')).toBe(true);
    expect(supports('eip155:8453')).toBe(true);
    expect(supports('eip155:11155111')).toBe(false);
    expect(supports('eip155:5042')).toBe(false);
    expect(supports('solana:mainnet')).toBe(false);
  });

  it('requires an explicit host view and preserves the entire pairing uri in the app link', () => {
    const provider = buildOathProvider();
    expect(() => provider.init({ WC_PROJECT_ID: 'test' })).toThrow(
      'direct connection view'
    );
    const uri = 'wc:test-topic@2?relay-protocol=irn&symKey=test-only';
    const link = new URL(oathConnectionLink(uri));
    expect(link.protocol).toBe('oathwallet:');
    expect(link.hostname).toBe('wc');
    expect(link.searchParams.get('uri')).toBe(uri);
  });
});
