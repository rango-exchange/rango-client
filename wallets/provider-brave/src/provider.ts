import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { brave } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (brave()) {
        setState('installed', true);
        console.debug('[brave] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
