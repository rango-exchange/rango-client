import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { cosmos } from './namespaces/cosmos.js';
import { keplr as keplrInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (keplrInstance()) {
        setState('installed', true);
        console.debug('[keplr] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('cosmos', cosmos)
    .build();

export { buildProvider };
