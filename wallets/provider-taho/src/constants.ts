import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const TAHO_WALLET_SUPPORTED_EVM_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.POLYGON,
  LegacyNetworks.OPTIMISM,
  LegacyNetworks.ARBITRUM,
  LegacyNetworks.AVAX_CCHAIN,
  LegacyNetworks.BSC,
];

export const WALLET_ID = 'taho';
export const metadata: ProviderMetadata = {
  name: 'Taho',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/taho/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
    brave:
      'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
    homepage: 'https://taho.xyz',
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
              allBlockchains.filter((blockchainMeta) =>
                TAHO_WALLET_SUPPORTED_EVM_CHAINS.includes(
                  blockchainMeta.name as LegacyNetworks
                )
              ),
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
