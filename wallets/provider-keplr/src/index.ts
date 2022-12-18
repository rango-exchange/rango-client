import {
  Network,
  WalletType,
  Connect,
  WalletSigners,
  Subscribe,
  getCosmosAccounts,
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
