import { beforeEach, test } from 'vitest';

import { evm } from '../blockchains/evm';
import { Provider } from '../hub';

// beforeEach(() => {});

test('predefined blockchains', () => {
  // Wallet Code
  const connect = () => {
    //
  };
  const subscriber = () => {
    //

    return () => {
      //
    };
  };

  const evm_provider = evm({
    id: 'meow-wallet-evm',
    defaultChainId: '0x1',
  })
    .action('connect', connect)
    .subscriber(subscriber);

  const meow_wallet = new Provider('meow-wallet');
  meow_wallet.add(evm_provider);

  // -------------------- Hub side --------------------

  // TODO: how it should know which blockchain provider should be used?
  const result = meow_wallet.get('meow-wallet-evm')?.connect('0x1');
});
