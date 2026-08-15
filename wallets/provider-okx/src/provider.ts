import type { Environments } from './namespaces/ton/types.js';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { ton } from './namespaces/ton/ton.js';
import { setEnvironments } from './namespaces/ton/utils.js';
import { utxo } from './namespaces/utxo.js';
import { okx as okxInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
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
    .add('evm', evm)
    .add('utxo', utxo)
    .add('ton', ton)

    .build();

export { buildProvider };
