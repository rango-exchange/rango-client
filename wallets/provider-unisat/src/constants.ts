import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_BITCOIN_CHAIN_ID,
  isChainSupported as isBip122ChainSupported,
} from '@hub3js/bip122';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'unisat';

export const metadata: ProviderMetadata = {
  name: 'UniSat',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/unisat/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo',
    homepage: 'https://unisat.io/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            isChainSupported: isBip122ChainSupported([CAIP_BITCOIN_CHAIN_ID]),
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
