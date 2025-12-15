import { ProviderBuilder } from '@rango-dev/wallets-core';

import {
  COSMOSTAION_INJECTION_DELAY,
  metadata,
  WALLET_ID,
} from './constants.js';
import { cosmos } from './namespaces/cosmos.js';
import { evm } from './namespaces/evm.js';
import { cosmostation } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (cosmostation()) {
          setState('installed', true);
          console.debug('[cosmostation] instance detected.', context);
        }
      }, COSMOSTAION_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('cosmos', cosmos)
    .add('evm', evm)
    .build();

export { buildProvider };
