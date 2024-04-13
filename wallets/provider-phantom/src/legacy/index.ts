import type { VLegacy } from '@rango-dev/wallets-core';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { getSolanaAccounts, Networks } from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import { WALLET_ID } from '../constants';

import { phantom as phantom_instance } from './helpers';
import signer from './signer';

const config = {
  type: WALLET_ID,
};

const getInstance = phantom_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const solanaInstance = instance.get(Networks.SOLANA);
  const result = await getSolanaAccounts({
    instance: solanaInstance,
    meta,
  });

  return result;
};

const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
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

const canSwitchNetworkTo: CanSwitchNetwork = () => false;

const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    const result = await instance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};

const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  const evms = evmBlockchains(allBlockChains);

  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: [...solana, ...evms],
  };
};

const v0: VLegacy = {
  config,
  getInstance,
  connect,
  subscribe,
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
};

export { v0 };
