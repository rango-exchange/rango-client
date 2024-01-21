import type {
  Connect,
  Networks,
  ProviderConnectResult,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { WalletTypes } from '@rango-dev/wallets-shared';

import {
  getAccounts,
  installSnap,
  metamask as metamask_instance,
  SHAPESHIFT_SNAP_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.SHAPESHIFT_SNAP;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance }: { instance: any }) => {
  let accounts: ProviderConnectResult[] = [];

  const installed = await installSnap(instance);

  if (!!installed) {
    accounts = await getAccounts(instance);
  }

  if (!accounts?.length) {
    throw new Error('Please make sure ShapeShift Snap is installed.');
  }

  return accounts;
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  return {
    name: 'ShapeShift Snap',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/metamask/icon.svg',
    installLink: {
      CHROME: 'https://shapeshift.com/snap',
      BRAVE: 'https://shapeshift.com/snap',

      FIREFOX: 'https://shapeshift.com/snap',
      EDGE: 'https://shapeshift.com/snap',
      DEFAULT: 'https://shapeshift.com/snap',
    },
    color: '#dac7ae',
    supportedChains: allBlockChains.filter((blockchainMeta) =>
      SHAPESHIFT_SNAP_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
    ),
  };
};
