import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ZCASH_CHAIN_ID,
  isChainSupported as isBip122ChainSupported,
} from '@hub3js/bip122';

import getSigners from './signer.js';

export const WALLET_ID = 'noir-wallet';

export const info: ProviderMetadata = {
  name: 'Noir Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/noir-wallet/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/noir-wallet/mfoghjbpfanobmnoemoepenjjcmfpmdn',
    homepage: 'https://www.zknoir.com/',
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
