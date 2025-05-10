import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'slush';
export const WALLET_NAME_IN_WALLET_STANDARD = 'Slush — A Sui wallet';

export const info: ProviderInfo = {
  name: 'Slush',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/slush/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    homepage: 'https://slush.app/',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['Sui'],
    },
  ],
};
