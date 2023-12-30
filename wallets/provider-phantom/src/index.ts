import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  getSolanaAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { solanaBlockchain } from 'rango-types';

import { phantom as phantom_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;
export const connect: Connect = getSolanaAccounts;

export const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
  const handleAccountsChanged = async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  instance?.on('accountChanged', handleAccountsChanged);

  return () => {
    instance?.off('accountChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    const result = await instance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: solana,
  };
};
