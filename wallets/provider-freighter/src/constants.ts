import type { ProviderMetadata } from '@hub3js/core';

import { isStellarNamespace } from '@hub3js/stellar';

import getSigners from './signer.js';

export const WALLET_ID = 'frighter';
export const HORIZON_URL = 'https://horizon.stellar.org';
export const RPC_URL = 'https://mainnet.sorobanrpc.com';
export const NETWORK_PASSPHRASE =
  'Public Global Stellar Network ; September 2015';
// The code of Freighter's `FreighterApiDeclinedError`.
export const FREIGHTER_DECLINED_ERROR_CODE = -4;

export const metadata: ProviderMetadata = {
  name: 'Freighter',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/freighter/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/freighter/',
    brave:
      'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk',
    homepage: 'https://www.freighter.app/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Stellar',
            value: 'Stellar',
            id: 'STELLAR',
            isChainSupported: isStellarNamespace,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
