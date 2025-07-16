import { ProviderBuilder } from '@rango-dev/wallets-core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { trustWallet as trustwalletInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (trustwalletInstance()) {
        setState('installed', true);
        console.debug('[trustwallet] instance detected.', context);
      }
    })
    .config('metadata', metadata)
    .config('deepLink', (context) => {
      return `trust://open_url?coin_id=60&url=${context.targetUrl}?autoConnect=${WALLET_ID}`;
    })
    .add('evm', evm)
    .add('solana', solana)
    .build();

export { buildProvider };
