import type { EvmActions } from '../src/actions/evm/interface';

import { expect, test, vi } from 'vitest';

import { BlockchainProvider, Provider } from '../src/hub';
import { Hub } from '../src/hub/hub';

test('connect through hub', () => {
  const evmConnect = vi.fn((_chain: string) => {
    return [
      '0x000000000000000000000000000000000000dead',
      '0x0000000000000000000000000000000000000000',
    ];
  });

  const evmProvider = new BlockchainProvider<EvmActions>()
    .action('connect', evmConnect)
    .build();
  const garbageWallet = new Provider('garbage-wallet');
  garbageWallet.add('evm', evmProvider);

  const myHub = new Hub().add(garbageWallet.id, garbageWallet);

  const evmResult = myHub.get(garbageWallet.id)?.get('evm').connect('0x0');

  expect(evmResult).toStrictEqual([
    '0x000000000000000000000000000000000000dead',
    '0x0000000000000000000000000000000000000000',
  ]);
});
