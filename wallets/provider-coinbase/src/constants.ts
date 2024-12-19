import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'coinbase';

export const info: ProviderInfo = {
  name: 'Coinbase',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coinbase/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    brave:
      'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    homepage: 'https://www.coinbase.com/wallet',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['evm', 'solana'],
    },
  ],
};
