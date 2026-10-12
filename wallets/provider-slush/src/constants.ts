import type { ProviderMetadata } from '@hub3js/core';

import { isSuiNamespace } from '@hub3js/sui';

import getSigners from './signer.js';

export const WALLET_ID = 'slush';
export const WALLET_NAME_IN_WALLET_STANDARD = 'Slush';
export const SLUSH_REJECTION_ERROR_NAME = 'TRPCClientError';
export const SLUSH_REJECTION_MESSAGE = 'User rejected the request.';

export const metadata: ProviderMetadata = {
  name: 'Slush',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/slush/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    edge: 'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    brave:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    homepage: 'https://slush.app/download',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        data: [
          {
            label: 'Sui',
            value: 'Sui',
            id: 'SUI',
            isChainSupported: isSuiNamespace,
          },
        ],
        selection: 'multiple',
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
