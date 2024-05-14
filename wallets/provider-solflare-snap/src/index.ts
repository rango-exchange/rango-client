import type {
  Connect,
  Disconnect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta } from 'rango-types';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { solanaBlockchain } from 'rango-types';

import { getSolflareSnapInstance } from './helpers';
import signer from './signer';

export const config = {
  type: WalletTypes.SOLFLARE_SNAP,
};

export const getInstance = getSolflareSnapInstance;
export const connect: Connect = async ({ instance }) => {
  try {
    await instance.connect();

    if (!!instance.standardAccounts?.length) {
      return {
        accounts: [
          instance.standardAccounts?.map((account: any) => account.address),
        ],
        chainId: Networks.SOLANA,
      };
    }

    return [];
  } catch (error) {
    throw new Error('Could not connect to Snap');
  }
};

export const disconnect: Disconnect = async ({ instance }) => {
  if (instance?.isConnected) {
    instance?.disconnect();
  }
};

export const subscribe: Subscribe = ({ instance, disconnect }) => {
  instance?.on('disconnect', async () => disconnect());
};

export const getSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Solana Snap',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/solflare-snap/icon.svg',
    installLink: {
      DEFAULT: 'https://solflare.com/metamask',
    },
    color: '#dac7ae',
    supportedChains: solana,
  };
};
