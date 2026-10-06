import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { utxo } from './namespaces/utxo.js';
import { unisat as unisatInstance } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (unisatInstance()) {
        setState('installed', true);
        console.debug('[unisat] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('utxo', utxo)
    .build();

export { buildProvider };
