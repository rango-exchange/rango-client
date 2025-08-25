import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants.js';
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
    .config('metadata', info)
    .config('deepLink', (context) => {
      const ref = `https://${context.appHost}`;
      const deepLinkDestination = `${context.targetUrl}?autoConnect=phantom`;
      return `https://phantom.app/ul/browse/${encodeURIComponent(
        deepLinkDestination
      )}?ref=${encodeURIComponent(ref)}`;
    })
    .add('solana', solana)
    .add('evm', evm)
    .add('utxo', utxo)
    .add('sui', sui)
    .build();

export { buildProvider };
