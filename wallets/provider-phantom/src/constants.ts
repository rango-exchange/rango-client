import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_BASE_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';
import { isSuiNamespace } from '@hub3js/sui';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const EVM_SUPPORTED_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_BASE_CHAIN_ID,
];

export const WALLET_ID = 'phantom';
export const WALLET_NAME_IN_WALLET_STANDARD = 'Phantom';

export const metadata: ProviderMetadata = {
  name: 'Phantom',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    homepage: 'https://phantom.app/',
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
          {
            label: 'Sui',
            value: 'Sui',
            id: 'SUI',
            isChainSupported: isSuiNamespace,
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
