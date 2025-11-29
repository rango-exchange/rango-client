import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, SOLFLARE_INJECTION_DELAY, WALLET_ID } from './constants.js';
import { solana } from './namespaces/solana.js';
import { solflare } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (solflare()) {
          setState('installed', true);
          console.debug('[solflare] instance detected.', context);
        }
      }, SOLFLARE_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .build();

export { buildProvider };
