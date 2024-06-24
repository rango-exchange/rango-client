import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';

import { WalletTypes } from '@rango-dev/wallets-shared';
import TrezorConnect from '@trezor/connect-web';
import {
  type BlockchainMeta,
  evmBlockchains,
  type SignerFactory,
} from 'rango-types';

import { getEthereumAccounts, getTrezorInstance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.TREZOR;
const trezorManifest = { appUrl: 'https://rango.exchange/', email: '' };
export const config = {
  type: WALLET,
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
  const evms = evmBlockchains(allBlockChains);

  return {
    name: 'Trezor',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trezor/icon.svg',
    installLink: {
      DEFAULT: 'https://trezor.io/learn/a/download-verify-trezor-suite',
    },
    color: 'black',
    supportedChains: evms,
    showOnMobile: false,
  };
};
