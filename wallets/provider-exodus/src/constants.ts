import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_AVAX_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'exodus';
export const EVM_SUPPORTED_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
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
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
