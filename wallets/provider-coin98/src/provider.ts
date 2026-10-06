import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { COIN98_INJECTION_DELAY, metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { coin98 } from './utils.js';

const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

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
    .add('evm', buildEvm(rpcURLs.evm))
    .add('solana', solana)
    .build();
};

export { buildProvider };
