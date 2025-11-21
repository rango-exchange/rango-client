import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { starknet } from './namespaces/starknet.js';
import { braavos } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (braavos()) {
        setState('installed', true);
        console.debug('[braavos] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('starknet', starknet)
    .build();

export { buildProvider };
