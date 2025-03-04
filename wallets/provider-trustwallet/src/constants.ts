import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'trust-wallet';

export const info: ProviderInfo = {
  name: 'Trust Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trustwallet/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    brave:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    homepage: 'https://trustwallet.com/browser-extension',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['EVM', 'Solana'],
    },
  ],
};
