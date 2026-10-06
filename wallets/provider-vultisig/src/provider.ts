import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { info, WALLET_ID } from './constants.js';
import { namespace as utxo } from './namespaces/utxo/namespace.js';
import { vultisig } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (vultisig()) {
        setState('installed', true);
        console.debug('[vultisig] instance detected.', context);
      }
    })
    .config('metadata', info)
    .add('utxo', utxo)
    .build();

export { buildProvider };
