import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { safepal as safepalInstance } from './utils.js';

const WAIT_TO_LOAD_INSTANCE_DELAY = 1000;
// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs?: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
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
};

export { buildProvider };
