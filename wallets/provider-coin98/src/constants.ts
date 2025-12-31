import type { ProviderMetadata } from '@rango-dev/wallets-core';

import { WalletTypes } from '@rango-dev/wallets-shared';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = WalletTypes.COIN98;
export const COIN98_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Coin98',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coin98/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    brave:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    homepage: 'https://coin98.com/wallet',
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
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              solanaBlockchain(allBlockchains),
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
