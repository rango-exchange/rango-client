import { describe, expect, test, vi } from 'vitest';

import { BlockchainProviderBuilder } from './blockchain';
import { useConnect } from './use';

describe('predefined uses should works correctly', () => {
  test('connecting should update internal state.', () => {
    const blockchainBuilder = new BlockchainProviderBuilder<{
      connect: () => string[];
    }>();
    blockchainBuilder.config('namespace', 'bip139');

    // add connect action and useConnect to add it state.
    const connect = vi.fn(() => {
      return ['0x000000000000000000000000000000000000dead'];
    });
    blockchainBuilder.action('connect', connect);

    const useConnectFn = vi.fn(useConnect);
    blockchainBuilder.use([{ name: 'connect', cb: useConnectFn }]);
    const blockchain = blockchainBuilder.build();
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
