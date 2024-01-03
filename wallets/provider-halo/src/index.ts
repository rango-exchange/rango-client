import type {
  CanSwitchNetwork,
  Connect,
  Networks,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@yeager-dev/wallets-shared';

import {
  getHaloInstance as halo_instance,
  HALO_WALLET_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.HALO;

export const config = {
  type: WALLET,
};

export const getInstance = halo_instance;
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  return {
    name: 'Halo',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/halo/icon.svg',
    color: '#b2dbff',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/halo-wallet/nbdpmlhambbdkhkmbfpljckjcmgibalo',
      BRAVE:
        'https://chrome.google.com/webstore/detail/halo-wallet/nbdpmlhambbdkhkmbfpljckjcmgibalo',
      DEFAULT: 'https://halo.social/',
    },
    supportedChains: allBlockChains.filter((blockchainMeta) =>
      HALO_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
    ),
  };
};
