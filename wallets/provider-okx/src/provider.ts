import type { Environments } from './namespaces/ton/types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { sui } from './namespaces/sui.js';
import { ton } from './namespaces/ton/ton.js';
import { setEnvironments } from './namespaces/ton/utils.js';
import { tron } from './namespaces/tron.js';
import { utxo } from './namespaces/utxo.js';
import { okx as okxInstance } from './utils.js';

const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

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
    .add('solana', solana)
    .add('evm', buildEvm(rpcURLs.evm))
    .add('utxo', utxo)
    .add('ton', ton)
    .add('tron', tron)
    .add('sui', sui)

    .build();
};

export { buildProvider };
