import type { EvmActions } from '../src/namespaces/evm/types';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder, ProviderBuilder } from '../src/builders';
import { Hub } from '../src/hub/hub';
import { createStore, type Store } from '../src/hub/store';
import { garbageWalletInfo } from '../src/test-utils/fixtures';

describe('aa', () => {
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

  test('connect through hub', () => {
    const evmConnect = vi.fn((_context, _chain: string) => {
      return [
        '0x000000000000000000000000000000000000dead',
        '0x0000000000000000000000000000000000000000',
      ];
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
    const evmResult = wallet?.get('evm').connect('0x0');

    expect(evmResult).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
      '0x0000000000000000000000000000000000000000',
    ]);
  });
});
