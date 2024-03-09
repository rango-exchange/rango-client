import type { Accounts, EvmActions } from '../src/actions/evm/interface';
import type { SolanaActions } from '../src/actions/solana/interface';

import { describe, expect, test, vi } from 'vitest';

import { BlockchainProvider, Provider } from '../src/hub';

describe('check Provider works with Blockchain correctly', () => {
  test('connect successfully when two blockchain type has been added to Provider', () => {
    // Wallet Code
    const evmConnect = vi.fn((_chain: string) => {
      return ['0x000000000000000000000000000000000000dead'];
    });
    const solanaConnect = vi.fn(() => {
      return ['1nc1nerator11111111111111111111111111111111'];
    });

    const evmProvider = new BlockchainProvider<EvmActions>()
      .action('connect', evmConnect)
      .build();
    const solanaProvider = new BlockchainProvider<SolanaActions>()
      .action('connect', solanaConnect)
      .build();

    const garbageWallet = new Provider('garbage-wallet');
    garbageWallet.add('evm', evmProvider);
    garbageWallet.add('solana', solanaProvider);
    const evmResult = garbageWallet.get('evm')?.connect('0x1');
    const solanaResult = garbageWallet.get('solana')?.connect();

    expect(evmResult).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    expect(solanaResult).toStrictEqual([
      '1nc1nerator11111111111111111111111111111111',
    ]);

    expect(evmConnect).toBeCalledTimes(1);
    expect(solanaConnect).toBeCalledTimes(1);
  });

  test('check post actions to work correctly.', () => {
    const evmConnect = vi.fn((_chain: string) => {
      return [
        '0x000000000000000000000000000000000000dead',
        '0x0000000000000000000000000000000000000000',
      ];
    });

    const afterConnect = vi.fn((accounts: Accounts) => {
      return accounts.map((account) => `eip155:${account}`);
    });

    const evmDisconnect = vi.fn();
    const afterDisconnect = vi.fn();

    const evmProvider = new BlockchainProvider<EvmActions>()
      .action('connect', evmConnect)
      .action('disconnect', evmDisconnect)
      .and('disconnect', afterDisconnect)
      .use([
        {
          name: 'connect',
          cb: afterConnect,
        },
      ])
      .build();
    const garbageWallet = new Provider('garbage-wallet');
    garbageWallet.add('evm', evmProvider);

    const evmResult = garbageWallet.get('evm')?.connect('0x1');

    expect(evmResult).toStrictEqual([
      'eip155:0x000000000000000000000000000000000000dead',
      'eip155:0x0000000000000000000000000000000000000000',
    ]);

    garbageWallet.get('evm')?.connect('0x1');
    garbageWallet.get('evm')?.disconnect('0x1');
    expect(evmConnect).toBeCalledTimes(2);
    expect(afterConnect).toBeCalledTimes(2);

    expect(evmDisconnect).toBeCalledTimes(1);
    expect(afterDisconnect).toBeCalledTimes(1);
  });
});
