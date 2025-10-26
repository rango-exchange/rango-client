import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { namespace as xrpl } from './namespaces/xrpl/mod.js';
import { checkInstallationOnLoad } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      const setInstallState = (result: boolean) =>
        setState('installed', result);

      checkInstallationOnLoad().then(setInstallState).catch(console.error);
    })
    .config('metadata', info)
    .add('xrpl', xrpl)
    .build();

export { buildProvider };
