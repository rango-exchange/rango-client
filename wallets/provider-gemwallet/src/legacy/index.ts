import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';

import { chains as solanaChains } from '@rango-dev/wallets-core/namespaces/solana';
import {
  type BlockchainMeta,
  DefaultSignerFactory,
  solanaBlockchain,
} from 'rango-types';

import { WALLET_ID } from '../constants.js';

export const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config: {
    type: WALLET_ID,
  },
  getWalletInfo: (allBlockChains) => {
    const supportedChains: BlockchainMeta[] = solanaBlockchain(allBlockChains);

    return {
      name: 'GemWallet',
      img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
      installLink: {
        CHROME:
          'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

        DEFAULT: 'https://phantom.app/',
      },
      color: '#4d40c6',
      // if you are adding a new namespace, don't forget to also update `properties`
      needsNamespace: {
        selection: 'multiple',
        data: [
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            chains: [solanaChains.solana],
          },
        ],
      },
      supportedChains,
    };
  },
  connect: async () => {
    return [];
  },
  getInstance: () => ({}),
  getSigners: async () => {
    return new DefaultSignerFactory();
  },
});
