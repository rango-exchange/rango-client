import { type ProviderInfo } from '@rango-dev/wallets-core';
import { Namespace, Networks } from '@rango-dev/wallets-core/legacy';

export const EVM_SUPPORTED_CHAINS = [Networks.ETHEREUM, Networks.POLYGON];

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
      value: [Namespace.Solana, Namespace.Evm],
    },
  ],
};
