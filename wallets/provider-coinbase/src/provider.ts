import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { coinbase as coinbaseInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (coinbaseInstance()) {
        setState('installed', true);
        console.debug('[coinbase] instance detected.', context);
      }
    })
    .config('info', info)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
