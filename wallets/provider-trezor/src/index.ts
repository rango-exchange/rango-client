import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';
import type { Manifest } from '@trezor/connect-web';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import TrezorConnect from '@trezor/connect-web';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import { getEthereumAccounts, getTrezorInstance } from './helpers';
import signer from './signer';

let trezorManifest: Manifest = {
  appUrl: '',
  email: '',
};
export const config = {
  type: WalletTypes.TREZOR,
};

export type { Manifest };

export const setManifest = (manifest: Manifest) => {
  trezorManifest = manifest;
};

export const getInstance = getTrezorInstance;
export const connect: Connect = async () => {
  const { success } = await TrezorConnect.getDeviceState();
  if (!success) {
    await TrezorConnect.init({
      lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
      manifest: trezorManifest,
    });
  }
  return await getEthereumAccounts();
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
