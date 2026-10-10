import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';

export const WALLET_ID = 'safe';

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
  ],
};
