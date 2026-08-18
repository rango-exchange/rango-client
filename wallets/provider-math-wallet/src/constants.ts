import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'math';
export const MATH_WALLET_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Math Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/math/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
    brave:
      'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
    homepage: 'https://mathwallet.org/en-us/',
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
            isChainSupported: isEvmNamespace,
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
