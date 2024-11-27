import type { Environments, TonProvider } from './types.js';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { tonBlockchain } from 'rango-types';

import { getAccounts, myTonWallet as myTonWallet_instance } from './helpers.js';
import signer from './signer.js';

let envs: Environments = {
  manifestUrl: '',
};

const WALLET = WalletTypes.MY_TON_WALLET;

export const config = {
  type: WALLET,
};

export type { Environments };

export const init = (environments: Environments) => {
  envs = environments;
};

export const getInstance = myTonWallet_instance;
export const connect: Connect = async ({ instance }) => {
  const tonInstance = instance as TonProvider;
  const result = await tonInstance.restoreConnection();

  const accounts = await getAccounts(result);

  if (accounts) {
    return { accounts, chainId: Networks.TON };
    // eslint-disable-next-line no-else-return
  } else {
    const result = await tonInstance.connect(2, {
      manifestUrl: envs.manifestUrl,
      items: [{ name: 'ton_addr' }],
    });

    const accounts = await getAccounts(result);

    if (accounts) {
      return { accounts, chainId: Networks.TON };
    }

    throw new Error(
      'message' in result.payload
        ? result.payload.message
        : 'error connecting to MyTonWallet'
    );
  }
};

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    const tonInstance = instance as TonProvider;
    const result = await tonInstance.restoreConnection();
    if ('items' in result.payload) {
      const accounts = result.payload?.items;
      return !!(accounts && accounts.length);
    }
    return false;
  } catch (error) {
    return false;
  }
};
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
