import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'unisat';

export const info: ProviderInfo = {
  name: 'UniSat',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/unisat/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo',
    homepage: 'https://unisat.io/',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['UTXO'],
    },
  ],
};
