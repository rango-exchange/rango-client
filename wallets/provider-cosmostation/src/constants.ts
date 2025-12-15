import { type ProviderMetadata } from '@rango-dev/wallets-core';
import {
  type BlockchainMeta,
  cosmosBlockchains,
  evmBlockchains,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'cosmostation';
export const COSMOSTAION_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Cosmostation',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/cosmostation/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
    brave:
      'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
    homepage: 'https://cosmostation.io/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              evmBlockchains(allBlockchains),
          },
          {
            label: 'Cosmos',
            value: 'Cosmos',
            id: 'COSMOS',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              cosmosBlockchains(allBlockchains),
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
