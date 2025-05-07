import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'coin98';

export const info: ProviderInfo = {
  name: 'Coin98',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coin98/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    brave:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    homepage: 'https://coin98.com/wallet',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['evm', 'solana'],
    },
  ],
};
