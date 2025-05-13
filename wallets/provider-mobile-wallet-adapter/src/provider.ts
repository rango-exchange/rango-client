import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { solana } from './namespaces/solana.js';
import { mobileWalletAdapter } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (mobileWalletAdapter()) {
        setState('installed', true);
      }
    })
    .config('info', info)
    .add('solana', solana)
    .build();

export { buildProvider };
