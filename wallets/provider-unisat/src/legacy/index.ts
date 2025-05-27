import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { chains as utxoChains } from '@rango-dev/wallets-core/namespaces/utxo';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

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
    // if you are adding a new namespace, don't forget to also update `properties`
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'BTC',
          value: 'UTXO',
          id: 'BTC',
          chains: [utxoChains.bitcoin],
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
