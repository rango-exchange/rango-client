import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { trustWallet as trustwalletInstance } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (trustwalletInstance()) {
        setState('installed', true);
        console.debug('[trustwallet] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .add('solana', solana)
    .build();
};

export { buildProvider };
