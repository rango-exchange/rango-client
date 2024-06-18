import type { Context } from '../src/hub/namespaces/mod.js';
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
    const spyOnEvmConnect = vi.fn();
    const evmConnect: FunctionWithContext<
      EvmActions['connect'],
      Context
    > = async (_context, _chain) => {
      spyOnEvmConnect();
      return {
        accounts: ['eip155:0x1:0x000000000000000000000000000000000000dead'],
        network: 'eth',
      };
    };

    const spyOnSolanaConnect = vi.fn();
    const solanaConnect: FunctionWithContext<
      SolanaActions['connect'],
      Context
    > = async () => {
      spyOnSolanaConnect();
      return ['solana:mainnet:1nc1nerator11111111111111111111111111111111'];
    };

    const evmProvider = new NamespaceBuilder<EvmActions>('eip155', walletName)
      .action('connect', evmConnect)
      .build();
    const solanaProvider = new NamespaceBuilder<SolanaActions>(
      'solana',
      walletName
    )
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
      'eip155:0x1:0x000000000000000000000000000000000000dead',
    ]);
    expect(solanaResult).toStrictEqual([
      'solana:mainnet:1nc1nerator11111111111111111111111111111111',
    ]);

    expect(spyOnEvmConnect).toBeCalledTimes(1);
    expect(spyOnSolanaConnect).toBeCalledTimes(1);
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
        network: result.network,
        accounts: result.accounts.map((account) => `eip155:0x1:${account}`),
      };
    });

    const evmDisconnect = vi.fn();
    const afterDisconnect = vi.fn();

    const evmProvider = new NamespaceBuilder<EvmActions>('eip155', walletName)
      .action('connect', evmConnect)
      .action('disconnect', evmDisconnect)
      .andUse([
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
      'eip155:0x1:0x000000000000000000000000000000000000dead',
      'eip155:0x1:0x0000000000000000000000000000000000000000',
    ]);

    await garbageWallet.get('evm')?.connect('0x1');
    garbageWallet.get('evm')?.disconnect();
    expect(spyOnConnect).toBeCalledTimes(2);
    expect(andConnect).toBeCalledTimes(2);

    expect(evmDisconnect).toBeCalledTimes(1);
    expect(afterDisconnect).toBeCalledTimes(1);
  });

  test('check `and` and `or` actions to work correctly.', async () => {
    const spyOnSuccessAndAction = vi.fn((_ctx, value) => value);
    const spyOnThrowAndAction = vi.fn();
    const spyOnThrowAndActionWithOr = vi.fn();

    const spyOnSuccessOrAction = vi.fn();
    const spyOnThrowOrAction = vi.fn();

    const garbageProvider = new NamespaceBuilder<{
      successfulAction: () => string;
      throwErrorAction: () => void;
      throwErrorActionWithOr: () => void;
    }>('eip155', walletName)
      .action('successfulAction', () => {
        return 'yay!';
      })
      .action([
        [
          'throwErrorAction',
          () => {
            throw new Error('whatever');
          },
        ],
        [
          'throwErrorActionWithOr',
          () => {
            throw new Error('whatever');
          },
        ],
      ])
      .andUse([
        ['successfulAction', spyOnSuccessAndAction],
        ['throwErrorAction', spyOnThrowAndAction],
        ['throwErrorActionWithOr', spyOnThrowAndActionWithOr],
      ])
      .orUse([
        ['successfulAction', spyOnSuccessOrAction],
        ['throwErrorActionWithOr', spyOnThrowOrAction],
      ])
      .build();

    garbageProvider.successfulAction();
    expect(spyOnSuccessAndAction).toBeCalledTimes(1);
    expect(spyOnSuccessAndAction).toHaveLastReturnedWith('yay!');

    expect(() => garbageProvider.throwErrorAction()).toThrowError();
    expect(spyOnThrowAndAction).toBeCalledTimes(0);

    garbageProvider.throwErrorActionWithOr();
    expect(spyOnThrowAndActionWithOr).toBeCalledTimes(0);
    expect(spyOnSuccessOrAction).toBeCalledTimes(0);
    expect(spyOnThrowOrAction).toBeCalledTimes(1);
  });
});
