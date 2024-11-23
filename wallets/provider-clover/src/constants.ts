import { type ProviderInfo } from '@rango-dev/wallets-core';

export const WALLET_ID = 'clover';

export const info: ProviderInfo = {
  name: 'Clover',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/clover/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    brave:
      'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    homepage: 'https://wallet.clover.finance',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['solana', 'evm'],
    },
  ],
};
