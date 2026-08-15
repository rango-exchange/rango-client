import type { ProviderMetadata } from '@hub3js/core';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { Networks } from '@rango-dev/wallets-shared';
import {
  type BlockchainMeta,
  solanaBlockchain,
  tonBlockchain,
  type TransferBlockchainMeta,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'okx';
export const TON_CONNECT_PROTOCOL_VERSION = 2;
export const TON_CONNECT_USER_REJECTED_CODE = 300;

export const OKX_WALLET_SUPPORTED_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.BSC,
  LegacyNetworks.POLYGON,
  LegacyNetworks.FANTOM,
  LegacyNetworks.ARBITRUM,
  LegacyNetworks.OPTIMISM,
  LegacyNetworks.CRONOS,
  LegacyNetworks.BOBA,
  LegacyNetworks.GNOSIS,
  LegacyNetworks.MOONBEAM,
  LegacyNetworks.MOONRIVER,
  LegacyNetworks.HARMONY,
  LegacyNetworks.AVAX_CCHAIN,
];

export const metadata: ProviderMetadata = {
  name: 'OKX',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/okx/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    brave:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/okexwallet',
    homepage: 'https://www.okx.com/web3',
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
                OKX_WALLET_SUPPORTED_CHAINS.includes(
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
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is TransferBlockchainMeta =>
                  chain.name === Networks.BTC
              ),
          },
          {
            label: 'Ton',
            value: 'Ton',
            id: 'TON',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              tonBlockchain(allBlockchains),
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
