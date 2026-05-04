import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { namespace as utxo } from './namespaces/utxo/namespace.js';
import { vultisig } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (vultisig()) {
        setState('installed', true);
        console.debug('[vultisig] instance detected.', context);
      }
    })
    .config('metadata', info)
    .add('utxo', utxo)
    .build();

export { buildProvider };
