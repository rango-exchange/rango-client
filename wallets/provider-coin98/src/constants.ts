import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { WalletTypes } from '@rango-dev/wallets-shared';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = WalletTypes.COIN98;
export const COIN98_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Coin98',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coin98/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    brave:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    homepage: 'https://coin98.com/wallet',
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
      value: {
        getSigners: async () => getSigners(getInstanceOrThrow()),
      },
    },
  ],
};
