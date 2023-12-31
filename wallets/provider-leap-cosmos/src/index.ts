import type {
  Connect,
  Subscribe,
  Suggest,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  getCosmosAccounts,
  Networks,
  suggestCosmosChain,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { cosmosBlockchains } from 'rango-types';

import { getSupportedChains, leap_cosmos_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.LEAP_COSMOS;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.COSMOS,
};

// TODO: check supported valid chain name : Some chain have different names
const supportedChainWithDifferentName: string[] = [
  Networks.COSMOS.toLowerCase(),
  Networks.KI.toLowerCase(),
  Networks.SECRET.toLowerCase(),
  Networks.TERRA.toLowerCase(),
];

export const getInstance = leap_cosmos_instance;
export const connect: Connect = async ({ instance, network, meta }) => {
  const supportedChains = await getSupportedChains(instance);

  const leapBlockchainMeta = meta.filter((chain) => {
    const isChainSupported = supportedChains.includes(chain.name.toLowerCase());
    const isNetworkMatch = chain.name === network;
    const isDifferentNameSupported = supportedChainWithDifferentName.includes(
      chain.name.toLocaleLowerCase()
    );

    return (
      chain.enabled &&
      (isChainSupported || isNetworkMatch || isDifferentNameSupported)
    );
  });

  const results = await getCosmosAccounts({
    instance,
    meta: leapBlockchainMeta,
    network: network || Networks.COSMOS,
  });
  return results;
};

export const subscribe: Subscribe = ({ connect, disconnect }) => {
  const handleAccountsChanged = () => {
    disconnect();
    connect();
  };
  window.addEventListener('leap_keystorechange', handleAccountsChanged);
  return () => {
    window.removeEventListener('leap_keystorechange', handleAccountsChanged);
  };
};

export const suggest: Suggest = async (options) => {
  const { instance, meta, network } = options;

  const supportedChains = await getSupportedChains(instance);
  const leapBlockchainMeta = meta.filter((chain) => {
    const isChainSupported = supportedChains.includes(chain.name.toLowerCase());
    const isNetworkMatch = chain.name === network;
    const isDifferentNameSupported = supportedChainWithDifferentName.includes(
      chain.name.toLocaleLowerCase()
    );

    return (
      chain.enabled &&
      (isChainSupported || isNetworkMatch || isDifferentNameSupported)
    );
  });
  await suggestCosmosChain({
    instance,
    meta: leapBlockchainMeta,
    network,
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Leap Cosmos',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/leap-cosmos/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      BRAVE:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      DEFAULT: 'https://www.leapwallet.io/cosmos',
    },
    color: 'black',
    supportedChains: cosmos.filter((blockchainMeta) => !!blockchainMeta.info),
  };
};
