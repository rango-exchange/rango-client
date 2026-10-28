import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { buildSolana } from './namespaces/solana.js';
import { ledger as ledgerInstance } from './utils.js';

const buildProvider = (rpcURLs?: NamespacesRPCUrls) => {
  return new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (ledgerInstance()) {
        setState('installed', true);
      }
    })
    .config('metadata', metadata)
    .add('solana', buildSolana(rpcURLs?.solana))
    .add('evm', buildEvm(rpcURLs?.evm))
    .build();
};

export { buildProvider };
