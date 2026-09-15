import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';

import getSigners from './signer.js';

export const WALLET_ID = 'wallet-connect-2';

export const metadata: ProviderMetadata = {
  name: 'WalletConnect',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/walletconnect/icon.svg',
  extensions: {
    homepage: 'https://walletconnect.com/',
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
        mobileWallet: true,
        showOnMobile: true,
      },
    },
  ],
};
