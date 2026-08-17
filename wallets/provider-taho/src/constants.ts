import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const TAHO_WALLET_SUPPORTED_EVM_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
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
            isChainSupported: (chainId: string) =>
              isEvmNamespace(chainId) &&
              TAHO_WALLET_SUPPORTED_EVM_CHAINS.includes(
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
