import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { exodus as exodusInstance } from './utils.js';

const WALLET_INJECTION_DELAY_MS = 1000;
const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init((context) =>
      setTimeout(function () {
        const [, setState] = context.state();

        if (exodusInstance()) {
          setState('installed', true);
          console.debug('[exodus] instance detected.', context);
        }
      }, WALLET_INJECTION_DELAY_MS)
    )
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
