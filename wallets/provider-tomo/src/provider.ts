import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, TOMO_INJECTION_DELAY, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { tomo } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      setTimeout(() => {
        if (tomo()) {
          setState('installed', true);
          console.debug('[tomo] instance detected.', context);
        }
      }, TOMO_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
