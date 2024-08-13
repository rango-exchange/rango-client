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

import { getBraavosInstance } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.BRAAVOS;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.STARKNET,
};

export const getInstance = getBraavosInstance;

export const connect: Connect = async ({ instance }) => {
  const accounts = await instance?.enable();
  if (!accounts?.length || !instance.isConnected) {
    throw new Error('Connection Error');
  }

  return { accounts: accounts || [], chainId: Networks.STARKNET };
};

export const subscribe: Subscribe = ({ instance, state, updateAccounts }) => {
  const handleAccountsChanged = (accounts: any) => {
    if (state.connected) {
      if (instance) {
        updateAccounts([accounts], Networks.STARKNET);
      }
    }
  };
  instance?.on?.('accountsChanged', handleAccountsChanged);
  return () => {
    instance?.off?.('accountsChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = ({ instance }) =>
  instance.isPreauthorized();

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const starknet = starknetBlockchain(allBlockChains);
  return {
    name: 'Braavos',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/braavos/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/braavos-smart-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma',
      BRAVE:
        'https://chrome.google.com/webstore/detail/braavos-smart-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet/',
      EDGE: 'https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc',
      DEFAULT: 'https://braavos.app/',
    },

    color: '#96e7ed',
    supportedChains: starknet,
  };
};
