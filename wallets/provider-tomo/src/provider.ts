import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, TOMO_INJECTION_DELAY, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { tomo } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
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
};

export { buildProvider };
