import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import {
  MATH_WALLET_INJECTION_DELAY,
  metadata,
  WALLET_ID,
} from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { mathWallet } from './utils.js';

const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      setTimeout(() => {
        if (mathWallet()) {
          setState('installed', true);
          console.debug('[math-wallet] instance detected.', context);
        }
      }, MATH_WALLET_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', buildEvm(rpcURLs.evm))
    .build();
};

export { buildProvider };
