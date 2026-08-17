import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_BASE_CHAIN_ID,
  CAIP_BERACHAIN_CHAIN_ID,
  CAIP_BLAST_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_CELO_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_FANTOM_CHAIN_ID,
  CAIP_LINEA_CHAIN_ID,
  CAIP_METIS_CHAIN_ID,
  CAIP_MONAD_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_SCROLL_CHAIN_ID,
  CAIP_SONIC_CHAIN_ID,
  CAIP_ZETA_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'binance';
export const EVM_SUPPORTED_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_LINEA_CHAIN_ID,
  CAIP_METIS_CHAIN_ID,
  CAIP_BLAST_CHAIN_ID,
  CAIP_CELO_CHAIN_ID,
  CAIP_FANTOM_CHAIN_ID,
  CAIP_MONAD_CHAIN_ID,
  CAIP_SONIC_CHAIN_ID,
  CAIP_BERACHAIN_CHAIN_ID,
  CAIP_BASE_CHAIN_ID,
  CAIP_ZETA_CHAIN_ID,
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_SCROLL_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
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
            isChainSupported: (chainId: string) =>
              isEvmNamespace(chainId) &&
              EVM_SUPPORTED_CHAINS.includes(
                getChainIdFromCaip2ChainId(chainId)
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
