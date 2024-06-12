import { type ProviderInfo } from '@rango-dev/wallets-core';
import { Namespaces } from '@rango-dev/wallets-core/namespaces/common';

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
      value: [Namespaces.Solana, Namespaces.Evm],
    },
  ],
};
