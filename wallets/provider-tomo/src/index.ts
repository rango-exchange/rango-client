import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@arlert-dev/wallets-shared';
import { evmBlockchains } from 'rango-types';

import { tomo as tomo_instance } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.TOMO;

export const config = {
  type: WALLET,
};

export const getInstance = tomo_instance;
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

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Tomo',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tomo/icon.svg',
    color: '#b2dbff',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
      BRAVE:
        'https://chromewebstore.google.com/detail/tomo-wallet/pfccjkejcgoppjnllalolplgogenfojk?hl=en',
      DEFAULT: 'https://tomo.inc/',
    },
    supportedChains: evms,
  };
};
