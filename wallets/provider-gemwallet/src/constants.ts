import type { ProviderMetadata } from '@hub3js/core';

import { isXrplNamespace } from '@hub3js/xrpl';

import getSigners from './signer.js';

export const XRPL_PUBLIC_SERVER = 'wss://xrplcluster.com/';
export const WALLET_ID = 'gemwallet';

export const info: ProviderMetadata = {
  name: 'GemWallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/gemwallet/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab',
    homepage: 'https://gemwallet.app/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'XRPL',
            value: 'XRPL',
            id: 'XRPL',
            isChainSupported: isXrplNamespace,
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
