import type { ProviderMetadata } from '@rango-dev/wallets-core';
import type { BlockchainMeta } from 'rango-types';

import { xrplBlockchain } from 'rango-types';

import getSigners from './signer.js';

export const XRPL_PUBLIC_SERVER = 'wss://xrplcluster.com/';
export const WALLET_ID = 'gemwallet';

export const info: ProviderMetadata = {
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
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'XRPL',
            value: 'XRPL',
            id: 'XRPL',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              xrplBlockchain(allBlockchains),
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
