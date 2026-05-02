import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { namespace as zcash } from './namespaces/zcash/namespace.js';
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
    .add('zcash', zcash)
    .build();

export { buildProvider };
