import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { sui } from './namespaces/sui.js';
import { suiWalletInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (suiWalletInstance()) {
        setState('installed', true);
        console.debug('[slush] instance detected.', context);
      }
    })
    .config('metadata', info)
    .add('sui', sui)
    .build();

export { buildProvider };
