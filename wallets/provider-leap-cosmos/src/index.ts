import type {
  StdBlockchainInfo,
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

import { getSupportedChains, leap_cosmos_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.LEAP_COSMOS;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.COSMOS,
};

export const getInstance = leap_cosmos_instance;
export const connect: Connect = async ({ instance, network, meta }) => {
  const supportedChains = await getSupportedChains(instance);
  const leapBlockchainMeta = meta.filter(
    (chain) =>
      supportedChains.includes(chain.id.toLowerCase()) || chain.id === network
  );
  const results = await getCosmosAccounts({
    instance,
    meta: leapBlockchainMeta,
  });
  return results;
};

export const subscribe: Subscribe = ({ connect, disconnect }) => {
  window.addEventListener('leap_keystorechange', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (
  allBlockChains: StdBlockchainInfo[]
) => WalletInfo = (allBlockChains) => {
  const blockchains = filterBlockchains(allBlockChains, {
    cosmos: true,
  });
  return {
    name: 'Leap Cosmos',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/leap-cosmos/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      BRAVE:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      DEFAULT: 'https://www.leapwallet.io/cosmos',
    },
    color: 'black',
    supportedBlockchains: blockchains,
  };
};
