import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { starknetBlockchain } from 'rango-types';

import { argentx as argentx_instances } from './helpers.js';
import signer from './signer.js';

/*
 * https://www.starknetjs.com/docs/API/signer
 * https://github.com/apibara/starknet-react
 * https://github.com/0xs34n/starknet.js
 * https://github.com/argentlabs/argent-x#-usage-with-your-dapp
 */

const WALLET = WalletTypes.ARGENTX;
const MAINNET_CHAIN_ID = 'SN_MAIN';

export const config = {
  type: WALLET,
  defaultNetwork: Networks.STARKNET,
};

export const getInstance = argentx_instances;

export const connect: Connect = async ({ instance }) => {
  let r = undefined;
  r = await instance?.enable();
  if (!r || !instance.isConnected || r?.length === 0) {
    throw new Error('Error connecting ArgentX');
  }
  if (instance?.chainId !== MAINNET_CHAIN_ID) {
    throw new Error(
      `Please switch to Mainnet, current network is ${instance?.chainId}`
    );
  }
  return { accounts: r ? r : [], chainId: Networks.STARKNET };
};

export const subscribe: Subscribe = ({ instance, state, updateAccounts }) => {
  const handleAccountsChanged = (accounts: any) => {
    if (state.connected) {
      if (instance) {
        updateAccounts(accounts, Networks.STARKNET);
      }
    }
  };
  instance?.on?.('accountsChanged', handleAccountsChanged);

  return () => {
    instance?.off?.('accountsChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const canEagerConnect: CanEagerConnect = ({ instance }) =>
  instance.isPreauthorized();

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const starknet = starknetBlockchain(allBlockChains);
  return {
    name: 'ArgentX',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/argentx/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb',
      BRAVE:
        'https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb',
      FIREFOX: 'https://addons.mozilla.org/en-GB/firefox/addon/argent-x',
      DEFAULT: 'https://www.argent.xyz',
    },

    color: '#96e7ed',
    supportedChains: starknet,
  };
};
