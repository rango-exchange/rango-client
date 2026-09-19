import type { EventHandler } from '../legacy/types.js';
import type { Namespace } from '@hub3js/namespaces';

import {
  createStore,
  Hub,
  NamespaceBuilder,
  ProviderBuilder,
} from '@hub3js/core';
import { WalletConnectionError } from '@hub3js/std/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AutoConnectionAttemptError } from '../errors.js';
import { Events } from '../legacy/types.js';

import { autoConnect } from './autoConnect.js';
import { HUB_LAST_CONNECTED_WALLETS } from './constants.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';

const WALLET = 'test-wallet';

type TestActions = {
  connect: (...args: unknown[]) => Promise<string[]>;
  canEagerConnect: () => Promise<boolean>;
};

type NamespaceBehaviour = {
  connect?: () => Promise<string[]>;
  canEagerConnect?: () => Promise<boolean>;
};

const storage = new LastConnectedWalletsFromStorage(HUB_LAST_CONNECTED_WALLETS);

function buildHub(
  namespaces: Partial<Record<Namespace, NamespaceBehaviour>>
): Hub {
  const providerBuilder = new ProviderBuilder(WALLET).config('metadata', {
    name: 'Test Wallet',
    icon: 'https://example.com/icon.svg',
    extensions: { homepage: 'https://example.com' },
  });

  Object.entries(namespaces).forEach(([namespaceId, behaviour = {}]) => {
    const namespace = new NamespaceBuilder<TestActions>(namespaceId, WALLET)
      .action('connect', async () =>
        behaviour.connect ? behaviour.connect() : []
      )
      .action('canEagerConnect', async () =>
        behaviour.canEagerConnect ? behaviour.canEagerConnect() : true
      )
      .build();
    providerBuilder.add(namespaceId, namespace);
  });

  return new Hub({ store: createStore() }).add(WALLET, providerBuilder.build());
}

async function runAutoConnect(hub: Hub) {
  const onUpdateState = vi.fn<EventHandler>();

  await autoConnect({ getHub: () => hub, allBlockChains: [], onUpdateState });
  // `autoConnect` resolves before the auto-connect attempts it starts have settled.
  await new Promise((resolve) => setTimeout(resolve, 0));

  return onUpdateState.mock.calls.filter(
    ([, event]) => event === Events.AUTO_CONNECT_FAILED
  );
}

describe('autoConnect', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.addWallet(WALLET, [
      { namespace: 'EVM', network: 'ETH' },
      { namespace: 'Solana', network: 'SOLANA' },
    ]);
  });

  it('send no event when every attempted namespace connected', async () => {
    const connect = vi.fn(async () => []);

    const events = await runAutoConnect(
      buildHub({ EVM: { connect }, Solana: { connect } })
    );

    expect(connect).toHaveBeenCalledTimes(2);
    expect(events).toEqual([]);
  });

  it('send no event when no namespace was attempted', async () => {
    const connect = vi.fn(async () => []);

    const events = await runAutoConnect(
      buildHub({
        EVM: {
          connect,
          canEagerConnect: async () => Promise.reject(new Error('locked')),
        },
        Solana: { connect, canEagerConnect: async () => false },
      })
    );

    expect(connect).not.toHaveBeenCalled();
    expect(events).toEqual([]);
  });

  it('send no event for a saved wallet that is not registered', async () => {
    localStorage.clear();
    storage.addWallet('unregistered-wallet', [
      { namespace: 'EVM', network: 'ETH' },
    ]);

    const events = await runAutoConnect(buildHub({ EVM: {} }));

    expect(events).toEqual([]);
  });

  it('send an auto connection attempt error listing the tried namespaces with their saved networks', async () => {
    const solanaError = new Error('Solana failed');

    const events = await runAutoConnect(
      buildHub({
        EVM: {},
        Solana: { connect: async () => Promise.reject(solanaError) },
      })
    );

    expect(events).toHaveLength(1);
    const [type, , value] = events[0];
    expect(type).toBe(WALLET);
    expect(value).toBeInstanceOf(AutoConnectionAttemptError);
    expect(value.name).toBe('AutoConnectionAttemptError');
    expect(value.message).toBe('Solana failed');
    expect(value.requestedNamespaces).toStrictEqual([
      { namespace: 'EVM', network: 'ETH' },
      { namespace: 'Solana', network: 'SOLANA' },
    ]);
    expect(value.errors).toHaveLength(1);
    expect(value.errors[0]).toBeInstanceOf(WalletConnectionError);
    expect(value.errors[0]).toMatchObject({
      namespace: 'Solana',
      cause: solanaError,
    });
  });

  it('wrap a thrown value that is not an error object in a wallet connection error for its namespace', async () => {
    const events = await runAutoConnect(
      buildHub({
        EVM: { connect: async () => Promise.reject('User rejected') },
        Solana: {},
      })
    );

    const [, , value] = events[0];
    expect(value.errors[0]).toBeInstanceOf(WalletConnectionError);
    expect(value.errors[0]).toMatchObject({
      namespace: 'EVM',
      message: 'User rejected',
      cause: 'User rejected',
    });
  });

  it('leave saved namespaces the wallet no longer has out of the event', async () => {
    const evmError = new Error('EVM failed');

    const events = await runAutoConnect(
      buildHub({ EVM: { connect: async () => Promise.reject(evmError) } })
    );

    expect(events).toHaveLength(1);
    const [, , value] = events[0];
    expect(value.requestedNamespaces).toEqual([
      { namespace: 'EVM', network: 'ETH' },
    ]);
    expect(value.errors).toHaveLength(1);
    expect(value.errors[0]).toMatchObject({ namespace: 'EVM' });
  });

  it('remove the namespaces that failed to connect from storage', async () => {
    await runAutoConnect(
      buildHub({
        EVM: {},
        Solana: {
          connect: async () => Promise.reject(new Error('Solana failed')),
        },
      })
    );

    expect(storage.list()[WALLET]).toEqual([
      { namespace: 'EVM', network: 'ETH' },
    ]);
  });
});
