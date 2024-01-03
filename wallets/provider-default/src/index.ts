import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@yeager-dev/wallets-shared';
import { evmBlockchains } from 'rango-types';

import { defaultInjected } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.DEFAULT;

export const config = {
  type: WALLET,
};

export const getInstance = defaultInjected;
export const connect: Connect = async ({ instance }) => {
  /*
   * Note: We need to get `chainId` here, because for the first time
   * after opening the browser, wallet is locked, and don't give us accounts and chainId
   * on `check` phase, so `network` will be null. For this case we need to get chainId
   * whenever we are requesting accounts.
   */
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Default',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/default/icon.svg',
    installLink: {
      DEFAULT: 'https://metamask.io/download/',
    },
    color: '#dac7ae',
    supportedChains: evms,
  };
};
