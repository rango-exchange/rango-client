import type { ProviderMetadata } from '@rango-dev/wallets-core';
import type { BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';

export const WALLET_ID = 'vultisig';

export const info: ProviderMetadata = {
  name: 'Vultisig',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/vultisig/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/vultisig-extension/ggafhcdaplkhmmnlbfjpnnkepdfjaelb',
    homepage: 'https://vultisig.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Zcash',
            value: 'ZCASH',
            id: 'ZCASH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (blockchain) => blockchain.name === 'ZCASH'
              ),
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
