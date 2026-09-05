import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ZCASH_CHAIN_ID,
  isChainSupported as isBip122ChainSupported,
} from '@hub3js/bip122';

import getSigners from './signer.js';

export const WALLET_ID = 'vultisig';

export const info: ProviderMetadata = {
  name: 'Vultisig',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/vultisig/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/vultisig-extension/ggafhcdaplkhmmnlbfjpnnkepdfjaelb',
    homepage: 'https://vultisig.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Zcash',
            value: 'UTXO',
            id: 'ZCASH',
            isChainSupported: isBip122ChainSupported([CAIP_ZCASH_CHAIN_ID]),
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
