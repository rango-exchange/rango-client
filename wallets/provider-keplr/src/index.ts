import {
  Network,
  WalletType,
  Connect,
  WalletSigners,
  Subscribe,
  getCosmosAccounts,
  BlockchainMeta,
  WalletInfo,
  cosmosBlockchains,
} from '@rangodev/wallets-shared';

import { keplr as keplrInstance } from './helpers';
import signer from './signer';

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

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Keplr',
    img: 'https://app.rango.exchange/wallets/keplr.png',
    installLink:
      'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    color: '#3898e5',
    supportedChains: cosmos.filter((blockchainMeta) => !!blockchainMeta.info),
  };
};
