import type { Environments } from './types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { ton } from './namespaces/ton.js';
import { tonConnect } from './utils.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context, environments: Environments) {
      const [, setState] = context.state();

      if (!environments) {
        throw new Error('TonConnect environments are required!');
      }

      async function initializeTon() {
        try {
          await tonConnect.initialize(environments);
          console.debug('[ton] instance initialized.', context);
          setState('installed', true);
        } catch (err) {
          console.warn('[ton] failed to initialize TonConnect:', err);
        }
      }
      void initializeTon();
    })
    .config('metadata', metadata)
    .add('ton', ton)
    .build();

export { buildProvider };
