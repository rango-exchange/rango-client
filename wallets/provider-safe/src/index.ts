import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  GetInstance,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, isEvmBlockchain } from 'rango-types';

import { getSafeInstance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.SAFE;

export const config = {
  type: WALLET,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async () => {
  return await getSafeInstance();
};

export const connect: Connect = async ({ instance }) => {
  const accounts = await instance.request({
    method: 'eth_accounts',
  });

  const { chainId } = instance;

  return { accounts, chainId };
};

export const subscribe: Subscribe = ({
  instance,
  state,
  updateChainId,
  updateAccounts,
  meta,
  connect,
  disconnect,
}) => {
  const evmBlockchainMeta = meta.filter(isEvmBlockchain);

  subscribeToEvm({
    instance,
    state,
    updateChainId,
    updateAccounts,
    meta: evmBlockchainMeta,
    connect,
    disconnect,
  });
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Safe',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safe/icon.svg',
    installLink: {
      DEFAULT: 'https://app.safe.global/',
    },
    color: '#ffffff',
    supportedChains: evms,
    hideWhenNotInstalled: true,
  };
};
