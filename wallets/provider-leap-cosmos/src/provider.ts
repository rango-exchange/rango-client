import { ProviderBuilder } from '@rango-dev/wallets-core';

import { LEAP_INJECTION_DELAY, metadata, WALLET_ID } from './constants.js';
import { cosmos } from './namespaces/cosmos.js';
import { leap as leapInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (leapInstance()) {
          setState('installed', true);
          console.debug('[leap] instance detected.', context);
        }
      }, LEAP_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('cosmos', cosmos)
    .build();

export { buildProvider };
