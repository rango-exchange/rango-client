import type { ProviderMetadata } from '@hub3js/core';
import type { BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';

export const WALLET_ID = 'noir-wallet';

export const info: ProviderMetadata = {
  name: 'Noir Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/noir-wallet/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/noir-wallet/mfoghjbpfanobmnoemoepenjjcmfpmdn',
    homepage: 'https://www.zknoir.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Zcash',
            value: 'UTXO',
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
