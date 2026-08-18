import { ProviderBuilder } from '@hub3js/core';
import { isNoirWalletInstalled } from '@noir-wallet/sdk';

import { info, WALLET_ID } from './constants.js';
import { namespace as utxo } from './namespaces/utxo.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (isNoirWalletInstalled()) {
        setState('installed', true);
        console.debug('[noir-wallet] instance detected.', context);
      }
    })
    .config('metadata', info)
    .add('utxo', utxo)
    .build();

export { buildProvider };
