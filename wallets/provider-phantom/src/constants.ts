import { type ProviderInfo } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export const EVM_SUPPORTED_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.POLYGON,
  LegacyNetworks.BASE,
];

export const WALLET_ID = 'phantom';

export const info: ProviderInfo = {
  name: 'Phantom',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    homepage: 'https://phantom.app/',
  },
  properties: [
    {
      name: 'detached',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: ['Solana', 'EVM'],
    },
  ],
};
