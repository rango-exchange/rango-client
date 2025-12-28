import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, TRONLINK_INJECTION_DELAY, WALLET_ID } from './constants.js';
import { tron } from './namespaces/tron.js';
import { tronlink } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (tronlink()) {
          setState('installed', true);
          console.debug('[tron-link] instance detected.', context);
        }
      }, TRONLINK_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('tron', tron)
    .build();

export { buildProvider };
