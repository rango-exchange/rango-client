import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { COIN98_INJECTION_DELAY, metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { coin98 } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      setTimeout(() => {
        if (coin98()) {
          setState('installed', true);
          console.debug('[coin98] instance detected.', context);
        }
      }, COIN98_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .add('solana', solana)
    .build();
};

export { buildProvider };
