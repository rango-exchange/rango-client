import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { tron } from './namespaces/tron.js';
import { utxo } from './namespaces/utxo.js';
import { bitget } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs?: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (bitget()) {
        setState('installed', true);
        console.debug('[bitget] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('tron', tron)
    .add('evm', evm)
    .add('utxo', utxo)
    .build();
};

export { buildProvider };
