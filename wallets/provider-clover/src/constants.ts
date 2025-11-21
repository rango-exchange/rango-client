import { type ProviderMetadata } from '@rango-dev/wallets-core';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const CLOVER_INJECTION_DELAY = 500;
export const WALLET_ID = 'clover';
export const metadata: ProviderMetadata = {
  name: 'Clover',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/clover/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    brave:
      'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    homepage: 'https://wallet.clover.finance',
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
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
