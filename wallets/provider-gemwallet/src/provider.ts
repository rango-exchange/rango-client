import { isInstalled } from '@gemwallet/api';
import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { xrpl } from './namespaces/xrpl.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      window.addEventListener('load', () => {
        isInstalled()
          .then((response) => {
            if (response.result.isInstalled) {
              setState('installed', true);
              console.debug('[gemwallet] instance detected.', context);
            }
          })
          .catch(console.error);
      });
    })
    .config('info', info)
    .add('xrpl', xrpl)
    .build();

export { buildProvider };
