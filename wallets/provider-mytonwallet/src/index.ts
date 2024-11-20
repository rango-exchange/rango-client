import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  TONEnvironments,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToTON,
  connectToTON,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { tonBlockchain } from 'rango-types';

import { myTonWallet as myTonWallet_instance } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.MY_TON_WALLET;

export const config = {
  type: WALLET,
};

let envs: TONEnvironments = {
  manifestUrl: '',
};

export type { TONEnvironments as Environments };

export const init = (environments: TONEnvironments) => {
  envs = environments;
};

export const getInstance = myTonWallet_instance;
export const connect: Connect = connectToTON(envs.manifestUrl);

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToTON;
export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const ton = tonBlockchain(allBlockChains);
  return {
    name: 'MyTonWallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/mytonwallet/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/mytonwallet-%C2%B7-my-ton-wall/fldfpgipfncgndfolcbkdeeknbbbnhcc',
      DEFAULT: 'https://mytonwallet.io/',
    },
    color: '#fff',
    supportedChains: ton,
  };
};
