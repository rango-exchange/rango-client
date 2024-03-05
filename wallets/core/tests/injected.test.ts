import type { EvmActions } from '../src/actions/evm/interface';

import { test } from 'vitest';

import { BlockchainProvider, Provider } from '../src/hub';
import { evm } from '../src/hub/use';

test('predefined blockchains', () => {
  // Wallet Code
  const connect = (aa) => {
    //
    return [aa, b];
  };
  const subscriber = () => {
    //

    return () => {
      //
    };
  };

  const evm_provider = new BlockchainProvider<EvmActions>()
    .action('connect', connect)
    .subscriber(subscriber)
    .use(evm)
    .build();

  const meow_wallet = new Provider('meow-wallet');
  meow_wallet.add('evm', evm_provider);

  // -------------------- Hub side --------------------

  // TODO: how it should know which blockchain provider should be used?
  const result = meow_wallet.get('evm')?.connect('0x1');
});
