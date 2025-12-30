import type { ProviderMetadata } from '@rango-dev/wallets-core';

import { WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = WalletTypes.TOMO;
export const TOMO_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Tomo',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tomo/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
    brave:
      'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
    homepage: 'https://tomo.inc/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
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
      name: 'signers',
      value: {
        getSigners: async () => getSigners(getInstanceOrThrow()),
      },
    },
  ],
};
