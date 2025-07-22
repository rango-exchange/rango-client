import { ProviderBuilder } from '@arlert-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { utxo } from './namespaces/utxo.js';
import { unisat as unisatInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (unisatInstance()) {
        setState('installed', true);
        console.debug('[unisat] instance detected.', context);
      }
    })
    .config('info', info)
    .add('utxo', utxo)
    .build();

export { buildProvider };
