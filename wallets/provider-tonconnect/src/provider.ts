import type { Environments } from './types.js';

import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { ton } from './namespaces/ton.js';
import { tonConnect } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(async function (context, environments: Environments) {
      const [, setState] = context.state();

      async function initializeTon() {
        try {
          await tonConnect.initialize(environments);
          console.debug('[ton] instance initialized.', context);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          /* empty */
        } finally {
          /*
           * we want to still show the TonConnect wallets
           * but we'll throw an error that we couldn't initialize it when the users want to connect to it
           */
          setState('installed', true);
        }
      }
      void initializeTon();
    })
    .config('metadata', metadata)
    .add('ton', ton)
    .build();

export { buildProvider };
