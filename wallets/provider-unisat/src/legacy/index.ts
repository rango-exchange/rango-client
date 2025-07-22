import type { LegacyProviderInterface } from '@arlert-dev/wallets-core/legacy';
import type { WalletInfo } from '@arlert-dev/wallets-shared';

import { LegacyNetworks as Networks } from '@arlert-dev/wallets-core/legacy';
import {
  type BlockchainMeta,
  type SignerFactory,
  type TransferBlockchainMeta,
} from 'rango-types';

import { info, WALLET_ID } from '../constants.js';
import { type Provider, unisat as unisat_instance } from '../utils.js';

import signer from './signer.js';

const config = {
  type: WALLET_ID,
};

export const getInstance = unisat_instance;

const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedChains: BlockchainMeta[] = [];
  const btc = allBlockChains.find((chain) => chain.name === Networks.BTC);
  if (btc) {
    supportedChains.push(btc);
  }

  return {
    name: info.name,
    img: info.icon,
    installLink: {
      CHROME: info.extensions.chrome,
      DEFAULT: info.extensions.homepage || '',
    },
    color: '#e9983d',
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'BTC',
          value: 'UTXO',
          id: 'BTC',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            allBlockchains.filter(
              (chain): chain is TransferBlockchainMeta =>
                chain.name === Networks.BTC
            ),
        },
      ],
    },
    supportedChains,
  };
};

const getSigners: (provider: Provider) => Promise<SignerFactory> = signer;

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config: config,
  getWalletInfo: getWalletInfo,
  connect: async () => {
    return [];
  },
  getInstance,
  getSigners,
});

export { buildLegacyProvider };
