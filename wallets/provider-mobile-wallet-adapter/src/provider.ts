import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { solana } from './namespaces/solana.js';
import { mobileWalletAdapter as phantomInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (phantomInstance()) {
        setState('installed', true);
        console.debug('[phantom] instance detected.', context);
      }
    })
    .config('info', info)
    .add('solana', solana)
    .build();

export { buildProvider };
