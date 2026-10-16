import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, SOLFLARE_INJECTION_DELAY, WALLET_ID } from './constants.js';
import { solana } from './namespaces/solana.js';
import { solflare } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (solflare()) {
          setState('installed', true);
          console.debug('[solflare] instance detected.', context);
        }
      }, SOLFLARE_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .build();

export { buildProvider };
