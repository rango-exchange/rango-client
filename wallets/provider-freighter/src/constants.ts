import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';

export const WALLET_ID = 'frighter';
export const HORIZON_URL = 'https://horizon.stellar.org';
export const NETWORK_PASSPHRASE =
  'Public Global Stellar Network ; September 2015';

export const metadata: ProviderMetadata = {
  name: 'Freighter',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/freighter/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/freighter/',
    brave:
      'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk',
    homepage: 'https://www.freighter.app/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Stellar',
            value: 'Stellar',
            id: 'STELLAR',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (blockchainMeta) =>
                  blockchainMeta.name === LegacyNetworks.STELLAR
              ),
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
