import type {
  BlockchainInfo,
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  filterBlockchains,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import {
  taho as taho_instances,
  TAHO_WALLET_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.TAHO;

export const config = {
  type: WALLET,
};

export const getInstance = taho_instances;

export const connect: Connect = async ({ instance }) => {
  const { accounts, chainId } = await getEvmAccounts(instance);

  return {
    accounts,
    chainId,
  };
};
export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainInfo[]) => WalletInfo = (
  allBlockChains
) => {
  const blockchains = filterBlockchains(allBlockChains, {
    ids: TAHO_WALLET_SUPPORTED_CHAINS,
  });
  return {
    name: 'Taho',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/taho/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
      BRAVE:
        'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
      DEFAULT: 'https://taho.xyz',
    },
    color: '#ffffff',
    supportedBlockchains: blockchains,
  };
};
