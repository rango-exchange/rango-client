import type { Environments } from './namespaces/ton/types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { buildSolana } from './namespaces/solana.js';
import { sui } from './namespaces/sui.js';
import { ton } from './namespaces/ton/ton.js';
import { setEnvironments } from './namespaces/ton/utils.js';
import { tron } from './namespaces/tron.js';
import { utxo } from './namespaces/utxo.js';
import { okx as okxInstance } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (rpcURLs?: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context, environments?: Environments) {
      setEnvironments(environments);
      const [, setState] = context.state();

      if (okxInstance()) {
        setState('installed', true);
        console.debug('[okx] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('solana', buildSolana(rpcURLs?.solana))
    .add('evm', evm)
    .add('utxo', utxo)
    .add('ton', ton)
    .add('tron', tron)
    .add('sui', sui)

    .build();
};

export { buildProvider };
