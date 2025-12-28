import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { utxo } from './namespaces/utxo.js';
import { ledger as ledgerInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (ledgerInstance()) {
        setState('installed', true);
      }
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', evm)
    .add('utxo', utxo)
    .build();

export { buildProvider };
