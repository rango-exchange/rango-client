import type { ProviderMetadata } from '@hub3js/core';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
  type TransferBlockchainMeta,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'ctrl';

// exported because it is also consumed by /queue-manager/queue-manager-demo
export const SUPPORTED_ETH_CHAINS = [
  LegacyNetworks.POLYGON,
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.BSC,
  LegacyNetworks.AVAX_CCHAIN,
  LegacyNetworks.FANTOM,
  LegacyNetworks.ARBITRUM,
];

const SUPPORTED_UTXO_CHAINS = [
  LegacyNetworks.BTC,
  LegacyNetworks.LTC,
  LegacyNetworks.DOGE,
  LegacyNetworks.BCH,
];

export const metadata: ProviderMetadata = {
  name: 'Ctrl',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/xdefi/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    brave:
      'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    homepage: 'https://ctrl.xyz/',
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
            label: 'UTXO',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain): chain is TransferBlockchainMeta =>
                SUPPORTED_UTXO_CHAINS.includes(chain.name as LegacyNetworks)
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
