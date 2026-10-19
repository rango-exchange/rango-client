import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';

export const WALLET_ID = 'tomo';
export const TOMO_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Tomo',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tomo/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
    brave:
      'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
    homepage: 'https://tomo.inc/',
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
  ],
};
