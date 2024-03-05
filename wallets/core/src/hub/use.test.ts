import { describe, expect, test, vi } from 'vitest';

import { BlockchainProvider } from './blockchain';
import { useConnect } from './use';

describe('predefined uses should works correctly', () => {
  test('connecting should update internal state.', () => {
    const blockchain = new BlockchainProvider({
      category: 'evm',
    });
    const connect = vi.fn(() => {
      return ['0x000000000000000000000000000000000000dead'];
    });

    // add connect action and useConnect to add it state.
    blockchain.action('connect', connect);
    const useConnectFn = vi.fn(useConnect);
    const uses = [{ name: 'connect', cb: useConnectFn }];
    blockchain.use(uses);
    blockchain.run('connect');

    const [getState] = blockchain.state();
    const accounts = getState('accounts');
    expect(accounts).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    expect(connect).toHaveBeenCalledTimes(1);
    expect(useConnectFn).toHaveBeenCalledTimes(1);
  });
});
