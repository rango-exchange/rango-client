import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { ledger as ledgerInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (ledgerInstance()) {
        setState('installed', true);
      }
    })
    .config('info', info)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
