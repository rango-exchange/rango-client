import { type ProviderInfo } from '@rango-dev/wallets-core';

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
    homepage: 'https://rabby.io/',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['EVM'],
    },
  ],
};
