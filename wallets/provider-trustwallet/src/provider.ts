import { ProviderBuilder } from '@arlert-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
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
    .config('info', info)
    .add('evm', evm)
    .add('solana', solana)
    .build();

export { buildProvider };
