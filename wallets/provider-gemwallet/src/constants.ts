import type { BlockchainMeta } from 'rango-types';

import { type ProviderInfo } from '@rango-dev/wallets-core';
import { Networks } from '@rango-dev/wallets-shared';

export const WALLET_ID = 'gemwallet';

export const info: ProviderInfo = {
  name: 'GemWallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/gemwallet/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab',
    homepage: 'https://gemwallet.app/',
  },
  properties: [
    {
      name: 'namespaces',
      // if you are adding a new namespace, don't forget to also update `getWalletInfo`
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'XRPL',
            value: 'XRPL',
            id: 'XRPL',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain) => chain.name === Networks.XRPL),
          },
        ],
      },
    },
  ],
};
