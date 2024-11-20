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

import { tonkeeper as tonkeeper_instance } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.TONKEEPER;

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

export const getInstance = tonkeeper_instance;
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
    name: 'Tonkeeper',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/7fb19ed5d5019b4d6a41ce91b39cde64f86af4c6/wallets/tonkeeper/icon.svg',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/tonkeeper-%E2%80%94-wallet-for-to/omaabbefbmiijedngplfjmnooppbclkk',
      BRAVE:
        'https://chromewebstore.google.com/detail/tonkeeper-%E2%80%94-wallet-for-to/omaabbefbmiijedngplfjmnooppbclkk',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/tonkeeper/',
      EDGE: 'https://chromewebstore.google.com/detail/tonkeeper-%E2%80%94-wallet-for-to/omaabbefbmiijedngplfjmnooppbclkk',
      DEFAULT: 'https://tonkeeper.com/',
    },
    color: '#fff',
    supportedChains: ton,
  };
};
