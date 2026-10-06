import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID, XVERSE_INJECTION_DELAY_MS } from './constants.js';
import { utxo } from './namespaces/utxo.js';
import { xverse as unisatInstance } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      // TODO: We should remove this after we solved not initiating issue.
      setTimeout(() => {
        if (unisatInstance()) {
          setState('installed', true);
          console.debug('[xverse] instance detected.', context);
        }
      }, XVERSE_INJECTION_DELAY_MS);
    })
    .config('metadata', metadata)
    .add('utxo', utxo)
    .build();

export { buildProvider };
