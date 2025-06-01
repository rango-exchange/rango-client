import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { coin98 as coin98Instances } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (coin98Instances()) {
        setState('installed', true);
        console.debug('[phantom] instance detected.', context);
      }
    })
    .config('info', info)
    .add('solana', solana)
    .add('evm', evm)
    .build();

export { buildProvider };
