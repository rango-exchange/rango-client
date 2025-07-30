import { type ProviderInfo } from '@arlert-dev/wallets-core';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

export const WALLET_ID = 'rabby';

export const info: ProviderInfo = {
  name: 'Rabby',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/rabby/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    brave:
      'https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/rabby-wallet',
    homepage: 'https://rabby.io',
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
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              evmBlockchains(allBlockchains),
          },
        ],
      },
    },
  ],
};
