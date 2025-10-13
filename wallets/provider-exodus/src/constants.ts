import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type BlockchainMeta, solanaBlockchain } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'exodus';
export const EXODUS_WALLET_SUPPORTED_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.BSC,
  LegacyNetworks.POLYGON,
  LegacyNetworks.AVAX_CCHAIN,
];

export const metadata: ProviderMetadata = {
  name: 'Exodus',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/exodus/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    brave:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    homepage: 'https://www.exodus.com/download',
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
                EXODUS_WALLET_SUPPORTED_CHAINS.includes(
                  blockchainMeta.name as LegacyNetworks
                )
              ),
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
