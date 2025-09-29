import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { safepal as safepalInstance } from './utils.js';

const WAIT_TO_LOAD_INSTANCE_DELAY = 1000;
const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      setTimeout(() => {
        if (safepalInstance()) {
          const [, setState] = context.state();
          setState('installed', true);
          console.debug('[safepal] instance detected.', context);
        }
      }, WAIT_TO_LOAD_INSTANCE_DELAY);
    })

    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
