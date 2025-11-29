import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { tron } from './namespaces/tron.js';
import { bitget } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (bitget()) {
        setState('installed', true);
        console.debug('[bitget] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .add('tron', tron)
    .add('evm', evm)

    .build();

export { buildProvider };
