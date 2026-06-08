import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { utxo } from './namespaces/utxo.js';
import { ctrl as ctrlInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (ctrlInstance()) {
        setState('installed', true);
        console.debug('[ctrl] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .add('utxo', utxo)
    .add('solana', solana)
    .build();

export { buildProvider };
