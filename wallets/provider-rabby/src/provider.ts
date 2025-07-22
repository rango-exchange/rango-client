import { ProviderBuilder } from '@arlert-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { rabby as rabbyInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      if (rabbyInstance()) {
        setState('installed', true);
        console.debug('[rabby] instance detected.', context);
      }
    })
    .config('info', info)
    .add('evm', evm)
    .build();

export { buildProvider };
