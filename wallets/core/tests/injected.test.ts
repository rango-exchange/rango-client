import type { EvmActions } from '../src/actions/evm/interface';

import { assert, test } from 'vitest';

import { BlockchainProvider, Provider } from '../src/hub';
import { evm } from '../src/hub/use';

test('predefined blockchains', () => {
  // Wallet Code
  const connect = (chain: string) => {
    //
    return [chain];
  };
  const subscriber = () => {
    //

    return () => {
      //
    };
  };

  const evm_provider = new BlockchainProvider<EvmActions>()
    .action('connect', connect)
    .action('disconnect', (aa) => {
      //
      return aa;
    })
    .subscriber(subscriber)
    .use(evm)
    .use([
      {
        name: 'connect',
        // name: 'connect2',
        cb: () => {
          //
        },
      },
    ])
    .build();

  const meow_wallet = new Provider('meow-wallet');
  meow_wallet.add('evm', evm_provider);

  // -------------------- Hub side --------------------

  // TODO: how it should know which blockchain provider should be used?
  const _result = meow_wallet.get('evm')?.connect('0x1');

  assert(true);
});
