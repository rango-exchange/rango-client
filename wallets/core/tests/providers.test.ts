import type { Accounts, EvmActions } from '../src/actions/evm/interface';
import type { SolanaActions } from '../src/actions/solana/interface';

import { describe, expect, test, vi } from 'vitest';

import { BlockchainProviderBuilder } from '../src/hub';
import { ProviderBuilder } from '../src/hub/provider';

describe('check Provider works with Blockchain correctly', () => {
  test('connect successfully when two blockchain type has been added to Provider', async () => {
    // Wallet Code
    const evmConnect = vi.fn((_chain: string) => {
      return ['0x000000000000000000000000000000000000dead'];
    });
    const solanaConnect = vi.fn(async () => {
      return ['1nc1nerator11111111111111111111111111111111'];
    });

    const evmProvider = new BlockchainProviderBuilder<EvmActions>()
      .config('namespace', 'eip155')
      .action('connect', evmConnect)
      .build();
    const solanaProvider = new BlockchainProviderBuilder<SolanaActions>()
      .config('namespace', 'solana')
      .action('connect', solanaConnect)
      .build();

    const garbageWalletBuilder = new ProviderBuilder('garbage-wallet');
    garbageWalletBuilder.add('evm', evmProvider);
    garbageWalletBuilder.add('solana', solanaProvider);

    const garbageWallet = garbageWalletBuilder.build();
    const evmResult = garbageWallet.get('evm')?.connect('0x1');
    const solanaResult = await garbageWallet.get('solana')?.connect();

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

    const evmProvider = new BlockchainProviderBuilder<EvmActions>()
      .config('namespace', 'eip155')
      .action('connect', evmConnect)
      .action('disconnect', evmDisconnect)
      .use([
        {
          name: 'disconnect',
          cb: afterDisconnect,
        },
        {
          name: 'connect',
          cb: afterConnect,
        },
      ])
      .build();
    const garbageWalletBuilder = new ProviderBuilder('garbage-wallet');
    garbageWalletBuilder.add('evm', evmProvider);

    const garbageWallet = garbageWalletBuilder.build();
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
