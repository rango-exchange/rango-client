import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { safepal as safepalInstance } from './utils.js';

const WAIT_TO_LOAD_INSTANCE_DELAY = 1000;
const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

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
    .add('evm', buildEvm(rpcURLs.evm))
    .build();
};

export { buildProvider };
