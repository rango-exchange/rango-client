import { ProviderBuilder } from '@rango-dev/wallets-core';

import { CLOVER_INJECTION_DELAY, metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { clover } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      setTimeout(() => {
        if (clover()) {
          setState('installed', true);
          console.debug('[clover] instance detected.', context);
        }
      }, CLOVER_INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
