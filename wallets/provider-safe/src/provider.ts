import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { initSafe } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      /*
       * Safe detection is asynchronous (the SDK only resolves when embedded in
       * Safe{Wallet}), so we kick it off here and flip `installed` once the Safe
       * provider is available. Detection fails fast outside of Safe.
       */
      async function detectSafe() {
        if (await initSafe()) {
          setState('installed', true);
          console.debug('[safe] instance detected.', context);
        }
      }

      void detectSafe();
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
