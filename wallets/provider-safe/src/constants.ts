import type { ProviderMetadata } from '@hub3js/core';

import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { evmSafe } from './utils.js';

export const WALLET_ID = 'safe';

export const metadata: ProviderMetadata = {
  name: 'Safe',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safe/icon.svg',
  extensions: {
    homepage: 'https://app.safe.global/',
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
        ],
      },
    },
    {
      name: 'details',
      value: { isContractWallet: true },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners(evmSafe()) },
    },
  ],
};
