import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'token-pocket';
export const metadata: ProviderMetadata = {
  name: 'Token Pocket',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tokenpocket/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    brave:
      'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    homepage: 'https://www.tokenpocket.pro/en/download/app',
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
      name: 'signers',
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
