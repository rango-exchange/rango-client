import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'binance';
export const EVM_SUPPORTED_CHAINS = [
  LegacyNetworks.OPTIMISM,
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.LINEA,
  LegacyNetworks.METIS,
  LegacyNetworks.BLAST,
  LegacyNetworks.CELO,
  LegacyNetworks.FANTOM,
  LegacyNetworks.MONAD,
  LegacyNetworks.SONIC,
  LegacyNetworks.BERACHAIN,
  LegacyNetworks.BASE,
  LegacyNetworks.ZETA_CHAIN,
  LegacyNetworks.ARBITRUM,
  LegacyNetworks.BSC,
  LegacyNetworks.SCROLL,
  LegacyNetworks.AVAX_CCHAIN,
];

export const metadata: ProviderMetadata = {
  name: 'Binance Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/binance/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/binance-wallet/cadiboklkpojfamcoggejbbdjcoiljjk',
    brave:
      'https://chromewebstore.google.com/detail/binance-wallet/cadiboklkpojfamcoggejbbdjcoiljjk',
    homepage: 'https://www.binance.com/binancewallet',
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
                EVM_SUPPORTED_CHAINS.includes(
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
