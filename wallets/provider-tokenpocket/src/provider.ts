import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { tokenPocket } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (tokenPocket()) {
        setState('installed', true);
        console.debug('[token-pocket] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
