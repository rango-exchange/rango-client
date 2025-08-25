import type { EvmActions } from '../../namespaces/evm/types.js';
import type { SolanaActions } from '../../namespaces/solana/types.js';
import type { Store } from '../store/mod.js';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder } from '../../builders/namespace.js';
import { ProviderBuilder } from '../../builders/provider.js';
import { garbageWalletInfo } from '../../test-utils/fixtures.js';
import { createStore } from '../store/mod.js';

import { Provider } from './provider.js';

describe('check providers', () => {
  let namespaces: {
    evm: NamespaceBuilder<EvmActions>;
    solana: NamespaceBuilder<SolanaActions>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let namespacesMap: Map<any, any>;
  let store: Store;

  beforeEach(() => {
    store = createStore();
    const evmNamespace = new NamespaceBuilder<EvmActions>('eip155', 'garbage');
    const solanaNamespace = new NamespaceBuilder<SolanaActions>(
      'solana',
      'garbage'
    );

    namespaces = {
      evm: evmNamespace,
      solana: solanaNamespace,
    };

    namespacesMap = new Map();
    namespacesMap.set('evm', evmNamespace.build());
    namespacesMap.set('solana', solanaNamespace.build());

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (store = undefined), (namespaces = undefined);
    };
  });

  test('Initialize providers correctly', () => {
    const provider = new Provider('garbage', namespacesMap, {
      metadata: garbageWalletInfo,
    });

    const allNamespaces = provider.getAll();

    expect(allNamespaces.size).toBe(2);
  });

  test('throw error if state() is called before store initialization', () => {
    const provider = new Provider('garbage', namespacesMap, {
      metadata: garbageWalletInfo,
    });

    expect(() => provider.state()).toThrowError();
  });

  test('should return wallet info via info() without store initialization', () => {
    const provider = new Provider('garbage', namespacesMap, {
      info: garbageWalletInfo,
    });

    expect(provider.info()).toBe(garbageWalletInfo);
  });

  test('should return wallet info via info() after store initialization', () => {
    const store = createStore();
    const provider = new Provider(
      'garbage',
      namespacesMap,
      {
        info: garbageWalletInfo,
      },
      { store }
    );

    expect(provider.info()).toBe(
      store.getState().providers.list['garbage'].config.info
    );
  });

  test('access state correctly', () => {
    const provider = new Provider(
      'garbage',
      namespacesMap,
      {
        metadata: garbageWalletInfo,
      },
      {
        store: createStore(),
      }
    );

    const [getState, setState] = provider.state();

    expect(getState().connected).toBe(false);
    expect(getState('connected')).toBe(false);
    expect(() => {
      // @ts-expect-error intentionally using an state that doesn't exist.
      getState('not_exist_state');
    }).toThrowError();
    expect(() => {
      // @ts-expect-error intentionally using an state that doesn't exist and try to update.
      setState('another_not_exist_state');
    }).toThrowError();
  });
  test('update state properly', () => {
    const store = createStore();
    const provider = new Provider(
      'garbage',
      namespacesMap,
      {
        metadata: garbageWalletInfo,
      },
      {
        store,
      }
    );

    const [getState, setState] = provider.state();

    provider.store(store);
    setState('installed', true);
    const isInstalled = getState('installed');
    expect(isInstalled).toBe(true);
  });

  test('run namespace actions from provider', async () => {
    const { evm, solana } = namespaces;
    solana.action('connect', async () => [
      'solana:mainnet:0x000000000000000000000000000000000000dead',
    ]);
    const testNamespaces = new Map();
    testNamespaces.set('evm', evm.build());
    testNamespaces.set('solana', solana.build());

    const provider = new Provider('garbage', testNamespaces, {
      metadata: garbageWalletInfo,
    });

    const result = await provider.get('solana')?.connect();

    expect(result).toStrictEqual([
      'solana:mainnet:0x000000000000000000000000000000000000dead',
    ]);
    // Since we didn't add any action regarding connect for `evm`
    await expect(async () =>
      provider.get('evm')?.connect('0x1')
    ).rejects.toThrowError();
  });

  test('sets config properly', () => {
    const builder = new ProviderBuilder('garbage');
    const deepLinkMock = () => 'deep link';
    builder
      .config('metadata', garbageWalletInfo)
      .config('deepLink', deepLinkMock);
    const provider = builder.build().store(store);

    expect(provider.info()?.metadata).toStrictEqual(garbageWalletInfo);
    expect(provider.info()?.deepLink).toStrictEqual(deepLinkMock);
  });

  test('.init should works on Provider', () => {
    const builder = new ProviderBuilder('garbage').config(
      'metadata',
      garbageWalletInfo
    );
    let count = 0;
    builder.init(() => {
      count++;
    });
    const provider = builder.build().store(store);
    expect(count).toBe(0);
    provider.init();
    provider.init();
    provider.init();
    expect(count).toBe(1);
  });

  test(".init shouldn't do anything when use hasn't set anything", () => {
    const builder = new ProviderBuilder('garbage').config(
      'metadata',
      garbageWalletInfo
    );
    const provider = builder.build().store(store);
    expect(() => {
      provider.init();
      provider.init();
      provider.init();
    }).not.toThrow();
  });

  test('A provider can be found using its namespace', () => {
    const builder = new ProviderBuilder('garbage', { store }).config(
      'metadata',
      garbageWalletInfo
    );

    const { evm, solana } = namespaces;
    builder.add('evm', evm.build()).add('solana', solana.build());
    const provider = builder.build();

    const result = provider.findByNamespace('solana');
    expect(result).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    expect(result?.namespaceId).toBe('solana');

    const result2 = provider.findByNamespace('evm');
    expect(result2).toBeUndefined();
  });

  test('`before/after` is calling with correct context ', () => {
    const connect = vi.fn();
    const before = vi.fn(function (context) {
      const [, setState] = context.state();
      setState('installed', true);
    });
    const after = vi.fn(function (context) {
      const [, setState] = context.state();
      setState('installed', false);
    });

    const { evm } = namespaces;
    const evmNamespace = evm.action('connect', connect).build();

    const builder = new ProviderBuilder('garbage', { store })
      .add('evm', evmNamespace)
      .config('metadata', garbageWalletInfo);
    const provider = builder.build();

    const [getState] = provider.state();
    const result = provider.get('evm');

    // Adding `after` then make it will run
    provider.before('connect', before);
    void result?.connect('whatever');

    expect(connect).toBeCalledTimes(1);
    expect(before).toBeCalledTimes(1);
    expect(getState('installed')).toBe(true);

    // Adding `after` then make it will run
    provider.after('connect', after);
    void result?.connect('whatever');
    expect(connect).toBeCalledTimes(2);
    expect(after).toBeCalledTimes(1);

    expect(getState('installed')).toBe(false);
  });
});
