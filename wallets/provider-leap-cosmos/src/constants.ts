import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, cosmosBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'leap-cosmos';
export const LEAP_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Leap',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/leap-cosmos/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    brave:
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    homepage: 'https://www.leapwallet.io/cosmos',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Cosmos',
            value: 'Cosmos',
            id: 'Cosmos',
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
