import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_BASE_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_LINEA_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_SONIC_CHAIN_ID,
  CAIP_ZKSYNC_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';

import getSigners from './signer.js';

export const WALLET_ID = 'ledger-wallet';

// Name and chain the Ledger Solana wallet registers with in the Wallet Standard.
export const SOLANA_WALLET_STANDARD_NAME = 'Ledger';
export const SOLANA_WALLET_STANDARD_MAINNET = 'solana:mainnet';

/*
 * EVM chains supported by the Ledger Wallet Provider (Ledger Button).
 * Mirrors the provider's internal chain-id allow-list:
 * 1 (ETH), 10 (Optimism), 56 (BSC), 137 (Polygon), 146 (Sonic),
 * 324 (zkSync Era), 8453 (Base), 42161 (Arbitrum), 43114 (Avalanche),
 * 59144 (Linea).
 */
export const EVM_SUPPORTED_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_SONIC_CHAIN_ID,
  CAIP_BASE_CHAIN_ID,
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_LINEA_CHAIN_ID,
  CAIP_ZKSYNC_CHAIN_ID,
];

export const metadata: ProviderMetadata = {
  name: 'Ledger Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/ledger/icon.svg',
  extensions: {
    homepage: 'https://www.ledger.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            isChainSupported: (chainId: string) =>
              isEvmNamespace(chainId) &&
              EVM_SUPPORTED_CHAINS.includes(
                getChainIdFromCaip2ChainId(chainId)
              ),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            isChainSupported: isSolanaNamespace,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
    {
      name: 'details',
      value: {
        showOnMobile: false,
      },
    },
  ],
};
