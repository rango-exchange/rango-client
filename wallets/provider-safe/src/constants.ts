import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';
import { WalletTypes } from '@rango-dev/wallets-shared';

import getSigners from './signer.js';
import { evmSafe } from './utils.js';

export const WALLET_ID = WalletTypes.SAFE;

export const metadata: ProviderMetadata = {
  name: 'Safe',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safe/icon.svg',
  extensions: {
    homepage: 'https://app.safe.global/',
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
        ],
      },
    },
    {
      name: 'details',
      value: { isContractWallet: true },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners(evmSafe()) },
    },
  ],
};
