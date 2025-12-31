import type { ProviderMetadata } from '@rango-dev/wallets-core';

import { WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, tonBlockchain } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = WalletTypes.TON_CONNECT;

export const metadata: ProviderMetadata = {
  name: 'TON Connect',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/7fb19ed5d5019b4d6a41ce91b39cde64f86af4c6/wallets/tonconnect/icon.svg',
  extensions: {},
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'Ton',
            value: 'Ton',
            id: 'TON',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              tonBlockchain(allBlockchains),
          },
        ],
      },
    },
    {
      name: 'signers',
      value: {
        getSigners: async () => getSigners(getInstanceOrThrow()),
      },
    },
  ],
};
