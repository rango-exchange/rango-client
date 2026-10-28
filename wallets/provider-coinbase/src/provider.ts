import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { buildSolana } from './namespaces/solana.js';
import { coinbase as coinbaseInstance } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (rpcURLs?: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (coinbaseInstance()) {
        setState('installed', true);
        console.debug('[coinbase] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('solana', buildSolana(rpcURLs?.solana))
    .add('evm', evm)
    .build();
};

export { buildProvider };
