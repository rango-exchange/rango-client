import type { ProviderMetadata } from '@hub3js/core';

import { isStarknetNamespace } from '@hub3js/starknet';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'ready';
export const metadata: ProviderMetadata = {
  name: 'Ready',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/argentx/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/ready-wallet-formerly-arg/dlcobpjiigpikoobohmabehhmhfoodbb',
    brave:
      'https://chromewebstore.google.com/detail/ready-wallet-formerly-arg/dlcobpjiigpikoobohmabehhmhfoodbb',
    firefox: 'https://addons.mozilla.org/en-GB/firefox/addon/argent-x',
    homepage: 'https://www.ready.co/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Ready',
            value: 'Starknet',
            id: 'STARKNET',
            isChainSupported: isStarknetNamespace,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
