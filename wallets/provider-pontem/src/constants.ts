import type { ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'pontem';

export const info: ProviderInfo = {
  name: 'Pontem',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/pontem/icon.svg',
  extensions: {
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/pontem-aptos-wallet/',
    chrome:
      'https://chrome.google.com/webstore/detail/pontem-wallet/phkbamefinggmakgklpkljjmgibohnba',
    homepage: 'https://pontem.network/pontem-wallet',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['Solana'],
    },
  ],
};
