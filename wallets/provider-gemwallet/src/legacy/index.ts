import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';

import { Networks } from '@rango-dev/wallets-shared';
import { type BlockchainMeta } from 'rango-types';

import { WALLET_ID } from '../constants.js';
import signers from '../legacy/signers.js';

export const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config: {
    type: WALLET_ID,
  },
  getWalletInfo: (allBlockChains) => {
    const supportedChains: BlockchainMeta[] = allBlockChains.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      (chain) => chain.type === 'XRPL'
    );

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
            label: 'XRPL',
            value: 'XRPL',
            id: 'XRPL',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain) => chain.name === Networks.XRPL),
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
  getSigners: signers,
});
