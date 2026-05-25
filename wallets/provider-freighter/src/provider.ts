import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { namespace as stellar } from './namespaces/stellar/namespace.js';
import { checkInstallation } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();
      const setInstallState = (result: boolean) =>
        setState('installed', result);

      checkInstallation().then(setInstallState).catch(console.error);
    })
    .config('metadata', metadata)
    .add('stellar', stellar)
    .build();

export { buildProvider };
