import type { Environments } from './types.js';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Disconnect,
  GetInstance,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { TonConnectUI } from '@tonconnect/ui';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@arlert-dev/wallets-shared';
import { tonBlockchain } from 'rango-types';

import {
  getTonConnectUIModule,
  parseAddress,
  waitForConnection,
} from './helpers.js';
import signer from './signer.js';

let envs: Environments = {
  manifestUrl: '',
};

const WALLET = WalletTypes.TON_CONNECT;

export const config = {
  type: WALLET,
  isAsyncInstance: true,
  checkInstallation: false,
};

export type { Environments };

export const init = (environments: Environments) => {
  envs = environments;
};

let instance: TonConnectUI | null = null;

export const getInstance: GetInstance = async () => {
  if (!instance) {
    const { TonConnectUI } = await getTonConnectUIModule();
    instance = new TonConnectUI(envs);
  }
  return instance;
};

export const connect: Connect = async ({ instance }) => {
  const tonConnectUI: TonConnectUI = instance;
  const connectionRestored = await tonConnectUI.connectionRestored;

  if (connectionRestored && tonConnectUI.account?.address) {
    const parsedAddress = await parseAddress(tonConnectUI.account.address);
    return { accounts: [parsedAddress], chainId: Networks.TON };
  }

  await tonConnectUI.openModal();
  const result = await waitForConnection(tonConnectUI);
  const parsedAddress = await parseAddress(result);

  return {
    accounts: [parsedAddress],
    chainId: Networks.TON,
  };
};

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  const tonConnectUI = instance as TonConnectUI;
  const connectionRestored = await tonConnectUI.connectionRestored;
  return connectionRestored;
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: TonConnectUI) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const ton = tonBlockchain(allBlockChains);
  return {
    name: 'TON Connect',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/7fb19ed5d5019b4d6a41ce91b39cde64f86af4c6/wallets/tonconnect/icon.svg',
    installLink: '',
    color: '#fff',
    supportedChains: ton,
  };
};

export const disconnect: Disconnect = async ({ instance }) => {
  const tonConnectUI = instance as TonConnectUI;
  await tonConnectUI.disconnect();
};
