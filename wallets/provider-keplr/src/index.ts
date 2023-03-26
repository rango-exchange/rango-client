import {
  Network,
  WalletType,
  Connect,
  Subscribe,
  getCosmosAccounts,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { keplr as keplrInstance } from './helpers';
import signer from './signer';
import { SignerFactory, cosmosBlockchains, BlockchainMeta } from 'rango-types';

const WALLET = WalletType.KEPLR;

export const config = {
  type: WALLET,
  defaultNetwork: Network.COSMOS,
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Keplr',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/keplr.png',
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
