import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'mobile-wallet-adapter';

export const info: ProviderInfo = {
  name: 'Mobile Wallet Adapter',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/mobile-wallet-adapter/icon.svg',
  extensions: {},
  showOnDesktop: false,
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['Solana'],
    },
  ],
};
