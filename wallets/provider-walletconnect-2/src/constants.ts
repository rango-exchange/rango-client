import type { ProviderMetadata } from '@hub3js/core';

import { EIP1193_USER_REJECTED_REQUEST } from '@hub3js/core';
import { isEvmNamespace } from '@hub3js/evm';
import { getSdkError } from '@walletconnect/utils';

import getSigners from './signer.js';

export const WALLET_ID = 'wallet-connect-2';

// The documented codes a wallet answers a session proposal with when the user rejects it, plus the EIP-1193 code some wallets answer with instead.
export const WALLETCONNECT_REJECTION_CODES = [
  getSdkError('USER_REJECTED').code,
  getSdkError('USER_REJECTED_METHODS').code,
  EIP1193_USER_REJECTED_REQUEST,
];

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
