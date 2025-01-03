import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';

import { solanaBlockchain } from 'rango-types';

import { WALLET_ID } from './constants.js';

export const legacyProvider: LegacyProviderInterface = {
  connect: (): any => {
    throw new Error('not implemented');
  },
  getInstance: (): any => {
    throw new Error('not implemented');
  },
  getSigners: (): any => {
    throw new Error('not implemented');
  },

  config: {
    type: WALLET_ID,
  },
  getWalletInfo: (allBlockChains) => {
    const solana = solanaBlockchain(allBlockChains);

    return {
      name: 'Pontem',
      img: '',
      installLink: {
        CHROME: '',
        DEFAULT: '',
      },
      color: '#4d40c6',
      // if you are adding a new namespace, don't forget to also update `properties`
      supportedChains: [...solana],

      needsNamespace: {
        selection: 'multiple',
        data: [
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
          },
        ],
      },
    };
  },
};
