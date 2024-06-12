import type { Context } from '../src/hub/namespace.js';
import type {
  AccountsWithActiveChain,
  FunctionWithContext,
} from '../src/namespaces/common/types.js';
import type { EvmActions } from '../src/namespaces/evm/types.js';
import type { SolanaActions } from '../src/namespaces/solana/types.js';

import { describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder, ProviderBuilder } from '../src/builders/mod.js';
import { garbageWalletInfo } from '../src/test-utils/fixtures.js';

describe('check Provider works with Blockchain correctly', () => {
  const walletName = 'garbage-wallet';

  test('connect successfully when two blockchain type has been added to Provider', async () => {
    // Wallet Code
    const evmConnect = vi.fn(async (_context, _chain) => {
      return {
        accounts: ['0x000000000000000000000000000000000000dead'],
        network: 'eth',
      };
    });
    const solanaConnect = vi.fn(async () => {
      return ['1nc1nerator11111111111111111111111111111111'];
    });

    const evmProvider = new NamespaceBuilder<EvmActions>()
      .config('namespace', 'eip155')
      .config('providerId', walletName)
      .action('connect', evmConnect)
      .build();
    const solanaProvider = new NamespaceBuilder<SolanaActions>()
      .config('namespace', 'solana')
      .config('providerId', walletName)
      .action('connect', solanaConnect)
      .build();

    const garbageWalletBuilder = new ProviderBuilder(walletName).config(
      'info',
      garbageWalletInfo
    );
    garbageWalletBuilder.add('evm', evmProvider);
    garbageWalletBuilder.add('solana', solanaProvider);

    const garbageWallet = garbageWalletBuilder.build();
    const evmResult = await garbageWallet.get('evm')?.connect('0x1');
    const solanaResult = await garbageWallet.get('solana')?.connect();

    expect(evmResult?.accounts).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    expect(solanaResult).toStrictEqual([
      '1nc1nerator11111111111111111111111111111111',
    ]);

    expect(evmConnect).toBeCalledTimes(1);
    expect(solanaConnect).toBeCalledTimes(1);
  });

  test('check post actions to work correctly.', async () => {
    const spyOnConnect = vi.fn();
    const evmConnect: FunctionWithContext<EvmActions['connect'], Context> =
      async function (_context, _chain) {
        spyOnConnect();
        return {
          accounts: [
            '0x000000000000000000000000000000000000dead',
            '0x0000000000000000000000000000000000000000',
          ],
          network: 'eth',
        };
      };

    const andConnect = vi.fn((_context, result: AccountsWithActiveChain) => {
      return {
        ...result,
        accounts: result.accounts.map((account) => `eip155:${account}`),
      };
    });

    const evmDisconnect = vi.fn();
    const afterDisconnect = vi.fn();

    const evmProvider = new NamespaceBuilder<EvmActions>()
      .config('namespace', 'eip155')
      .config('providerId', walletName)
      .action('connect', evmConnect)
      .action('disconnect', evmDisconnect)
      .use([
        ['disconnect', afterDisconnect],
        ['connect', andConnect],
      ])
      .build();
    const garbageWalletBuilder = new ProviderBuilder('garbage-wallet').config(
      'info',
      garbageWalletInfo
    );
    garbageWalletBuilder.add('evm', evmProvider);

    const garbageWallet = garbageWalletBuilder.build();
    const evmResult = await garbageWallet.get('evm')?.connect('0x1');

    expect(evmResult?.accounts).toStrictEqual([
      'eip155:0x000000000000000000000000000000000000dead',
      'eip155:0x0000000000000000000000000000000000000000',
    ]);

    await garbageWallet.get('evm')?.connect('0x1');
    garbageWallet.get('evm')?.disconnect();
    expect(spyOnConnect).toBeCalledTimes(2);
    expect(andConnect).toBeCalledTimes(2);

    expect(evmDisconnect).toBeCalledTimes(1);
    expect(afterDisconnect).toBeCalledTimes(1);
  });
});
