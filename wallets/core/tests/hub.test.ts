import type { EvmActions } from '../src/namespaces/evm/types.js';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder, ProviderBuilder } from '../src/builders/mod.js';
import { Hub } from '../src/hub/hub.js';
import { createStore, type Store } from '../src/hub/store.js';
import { garbageWalletInfo } from '../src/test-utils/fixtures.js';

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
    const evmConnect = vi.fn(async (_context, _chain) => {
      return {
        accounts: [
          '0x000000000000000000000000000000000000dead',
          '0x0000000000000000000000000000000000000000',
        ],
        network: 'eth',
      };
    });

    const evmProvider = new NamespaceBuilder<EvmActions>()
      .config('namespace', 'eip155')
      .config('providerId', walletName)
      .action('connect', evmConnect)
      .build();
    const garbageWalletBuilder = new ProviderBuilder(walletName).config(
      'info',
      garbageWalletInfo
    );
    garbageWalletBuilder.add('evm', evmProvider);
    const garbageWallet = garbageWalletBuilder.build();

    const myHub = new Hub({
      store,
    }).add(garbageWallet.id, garbageWallet);
    const wallet = myHub.get(garbageWallet.id);
    // this is only for checking `.store` to has been set.
    wallet?.state();
    const evmResult = await wallet?.get('evm')?.connect('0x0');

    expect(evmResult?.accounts).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
      '0x0000000000000000000000000000000000000000',
    ]);
  });
});
