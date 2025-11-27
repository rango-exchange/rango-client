import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, cosmosBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'keplr';

export const metadata: ProviderMetadata = {
  name: 'Keplr',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/keplr/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    brave:
      'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/keplr',
    homepage: 'https://www.keplr.app',
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
