import { ProviderBuilder } from '@rango-dev/wallets-core';

import {
  MATH_WALLET_INJECTION_DELAY,
  metadata,
  WALLET_ID,
} from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { mathWallet } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      setTimeout(() => {
        if (mathWallet()) {
          setState('installed', true);
          console.debug('[math-wallet] instance detected.', context);
        }
      }, MATH_WALLET_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
