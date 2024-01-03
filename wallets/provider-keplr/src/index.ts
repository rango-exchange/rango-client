import type {
  Connect,
  Subscribe,
  Suggest,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  getCosmosAccounts,
  Networks,
  suggestCosmosChain,
  WalletTypes,
} from '@yeager-dev/wallets-shared';
import { cosmosBlockchains } from 'rango-types';

import { keplr as keplrInstance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.KEPLR;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.COSMOS,
};

export const getInstance = keplrInstance;

export const connect: Connect = async ({ instance, network, meta }) => {
  return await getCosmosAccounts({
    instance,
    meta,
    network,
  });
};

export const subscribe: Subscribe = ({ connect, disconnect }) => {
  const handleAccountsChanged = () => {
    disconnect();
    connect();
  };
  window.addEventListener('keplr_keystorechange', handleAccountsChanged);
  return () => {
    window.removeEventListener('keplr_keystorechange', handleAccountsChanged);
  };
};

export const suggest: Suggest = suggestCosmosChain;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Keplr',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/keplr/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
      BRAVE:
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/keplr',
      DEFAULT: 'https://www.keplr.app',
    },
    color: '#3898e5',
    supportedChains: cosmos.filter((blockchainMeta) => !!blockchainMeta.info),
  };
};
