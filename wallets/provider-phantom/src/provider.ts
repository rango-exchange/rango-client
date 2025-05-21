import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
import { generateDeepLink } from './legacy/index.js';
import { evm } from './namespaces/evm.js';
import { solana } from './namespaces/solana.js';
import { sui } from './namespaces/sui.js';
import { utxo } from './namespaces/utxo.js';
import { phantom as phantomInstance } from './utils.js';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context) {
      const [, setState] = context.state();

      if (phantomInstance()) {
        setState('installed', true);
        console.debug('[phantom] instance detected.', context);
      }
    })
    .config('info', info)
    .config('generateDeepLink', generateDeepLink)
    .add('solana', solana)
    .add('evm', evm)
    .add('utxo', utxo)
    .add('sui', sui)
    .build();

export { buildProvider };
