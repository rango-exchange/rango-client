import { ProviderBuilder } from '@hub3js/core';

import { INJECTION_DELAY, metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { defaultInjected } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      setTimeout(() => {
        if (defaultInjected()) {
          setState('installed', true);
          console.debug('[default] instance detected.', context);
        }
      }, INJECTION_DELAY);
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
