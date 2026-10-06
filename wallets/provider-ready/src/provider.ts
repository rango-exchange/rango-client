import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { starknet } from './namespaces/starknet.js';
import { ready } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (ready()) {
        setState('installed', true);
        console.debug('[ready] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('starknet', starknet)
    .build();

export { buildProvider };
