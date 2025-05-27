import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'gemwallet';

export const info: ProviderInfo = {
  name: 'GemWallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab',
    homepage: 'https://gemwallet.app/',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['Solana'],
    },
  ],
};
