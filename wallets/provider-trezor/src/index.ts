import type { Environments } from './types';
import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import {
  ETHEREUM_BIP32_PATH,
  getEthereumAccounts,
  getTrezorInstance,
} from './helpers';
import signer from './signer';

let trezorManifest: Environments['manifest'] = {
  appUrl: '',
  email: '',
};
export const config = {
  type: WalletTypes.TREZOR,
};

export type { Environments };

export const init = (environments: Environments) => {
  trezorManifest = environments.manifest;
};

export const getInstance = getTrezorInstance;

let isTrezorInitialized = false;
export const connect: Connect = async () => {
  const { default: TrezorConnect } = await import('@trezor/connect-web');

  if (!isTrezorInitialized) {
    await TrezorConnect.init({
      lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
      manifest: trezorManifest,
    });
    isTrezorInitialized = true;
  }
  return await getEthereumAccounts(ETHEREUM_BIP32_PATH);
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedChains: BlockchainMeta[] = [];

  const ethereumBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.ETHEREUM
  );
  if (ethereumBlockchain) {
    supportedChains.push(ethereumBlockchain);
  }
  return {
    name: 'Trezor',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trezor/icon.svg',
    installLink: {
      DEFAULT: 'https://trezor.io/learn/a/download-verify-trezor-suite',
    },
    color: 'black',
    supportedChains,
    showOnMobile: false,
  };
};
