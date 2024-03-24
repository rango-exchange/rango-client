import { beforeEach, describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder } from '../builders';

import { createStore, type Store } from './store';
import { useConnect } from './use';

describe('predefined uses should works correctly', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      store = undefined;
    };
  });

  test('connecting should update internal state.', () => {
    const blockchainBuilder = new NamespaceBuilder<{
      connect: () => string[];
    }>();
    blockchainBuilder.config('namespace', 'bip139');
    blockchainBuilder.config('providerId', 'garbage provider');

    // add connect action and useConnect to add it state.
    const connect = vi.fn(() => {
      return ['0x000000000000000000000000000000000000dead'];
    });
    blockchainBuilder.action('connect', connect);

    const useConnectFn = vi.fn(useConnect);
    blockchainBuilder.use([{ name: 'connect', cb: useConnectFn }]);
    const blockchain = blockchainBuilder.build();
    blockchain.store(store);
    blockchain.connect();

    const [getState] = blockchain.state();
    const accounts = getState('accounts');
    expect(accounts).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    expect(connect).toHaveBeenCalledTimes(1);
    expect(useConnectFn).toHaveBeenCalledTimes(1);
  });
});
