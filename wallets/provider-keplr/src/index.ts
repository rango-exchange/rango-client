import type {
  BlockchainInfo,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

import {
  filterBlockchains,
  getCosmosAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';

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
  window.addEventListener('keplr_keystorechange', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainInfo[]) => WalletInfo = (
  allBlockChains
) => {
  const blockchains = filterBlockchains(allBlockChains, {
    cosmos: true,
  });
  return {
    name: 'Keplr',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/keplr/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
      BRAVE:
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/keplr',
      DEFAULT: 'https://www.keplr.app',
    },
    color: '#3898e5',
    supportedBlockchains: blockchains,
  };
};
