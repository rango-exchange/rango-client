import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID, XVERSE_INJECTION_DELAY_MS } from './constants.js';
import { utxo } from './namespaces/utxo.js';
import { xverse as unisatInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (unisatInstance()) {
          setState('installed', true);
          console.debug('[xverse] instance detected.', context);
        }
      }, XVERSE_INJECTION_DELAY_MS);
    })
    .config('metadata', metadata)
    .add('utxo', utxo)
    .build();

export { buildProvider };
