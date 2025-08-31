import type { Context } from '../src/hub/namespaces/types.js';
import type { EvmActions } from '../src/namespaces/evm/types.js';
import type { FunctionWithContext } from '../src/types/actions.js';

import { beforeEach, describe, expect, test } from 'vitest';

import { NamespaceBuilder, ProviderBuilder } from '../src/builders/mod.js';
import { Hub } from '../src/hub/hub.js';
import { createStore, type Store } from '../src/hub/store/mod.js';
import { garbageWalletMetaData } from '../src/test-utils/fixtures.js';

describe('check hub', () => {
  const walletName = 'garbage-wallet';
  let store: Store;

  beforeEach(() => {
    store = createStore();

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      store = undefined;
    };
  });

  test('connect through hub', async () => {
    const evmConnect: FunctionWithContext<
      EvmActions['connect'],
      Context
    > = async (_context, _chain) => {
      return {
        accounts: [
          'eip155:0x1:0x000000000000000000000000000000000000dead',
          'eip155:0x1:0x0000000000000000000000000000000000000000',
        ],
        network: 'eth',
      };
    };

    const evmNamespace = new NamespaceBuilder<EvmActions>('eip155', walletName)
      .action('connect', evmConnect)
      .build();
    const garbageWalletBuilder = new ProviderBuilder(walletName).config(
      'metadata',
      garbageWalletMetaData
    );
    garbageWalletBuilder.add('evm', evmNamespace);
    const garbageWallet = garbageWalletBuilder.build();

    const myHub = new Hub({
      store,
    }).add(garbageWallet.id, garbageWallet);
    const wallet = myHub.get(garbageWallet.id);
    // this is only for checking `.store` to has been set.
    wallet?.state();
    const evmResult = await wallet?.get('evm')?.connect('0x0');

    expect(evmResult?.accounts).toStrictEqual([
      'eip155:0x1:0x000000000000000000000000000000000000dead',
      'eip155:0x1:0x0000000000000000000000000000000000000000',
    ]);
  });
  test('should remove wallet from both hub and store', async () => {
    const garbageWalletBuilder = new ProviderBuilder(walletName).config(
      'metadata',
      garbageWalletMetaData
    );
    const garbageWallet = garbageWalletBuilder.build();

    const myHub = new Hub({
      store,
    }).add(garbageWallet.id, garbageWallet);

    expect(myHub.get(garbageWallet.id)).toBe(garbageWallet);
    expect(Object.entries(store.getState().providers.list)).toHaveLength(1);
    expect(store.getState().providers.list[garbageWallet.id]).toBeTruthy();

    myHub.remove(garbageWallet.id);

    expect(myHub.get(garbageWallet.id)).toBeUndefined();
    expect(Object.entries(store.getState().providers.list)).toHaveLength(0);
    expect(store.getState().providers.list[garbageWallet.id]).toBeUndefined();
  });
});
