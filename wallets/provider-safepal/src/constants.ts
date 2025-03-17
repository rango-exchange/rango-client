import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'safepal';
export const info: ProviderInfo = {
  name: 'SafePal',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safepal/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    brave:
      'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/safepal-extension-wallet',
    homepage: 'https://www.safepal.com/download',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['evm', 'solana'],
    },
  ],
};
