import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  WalletInfo,
  Networks,
  CanEagerConnect,
} from '@rango-dev/wallets-shared';
import { SignerFactory, BlockchainMeta, tonBlockchain } from 'rango-types';
import { toUserFriendlyAddress } from '@tonconnect/sdk/';
import { myTonWallet as myTonWallet_instance } from './helpers';
import signer from './signer';
import { TonProvider, isTonAddressItemReply } from './types';
import { TONCONNECT_MANIFEST_URL } from './constants';

const WALLET = WalletTypes.MY_TON_WALLET;

export const config = {
  type: WALLET,
};

export const getInstance = myTonWallet_instance;
export const connect: Connect = async ({ instance }) => {
  // TODO : update wallets-shared types and remove type assertions
  const tonInstance = instance as TonProvider;
  const result = await tonInstance.restoreConnection();

  if ('items' in result.payload) {
    const accounts = result.payload?.items
      ?.filter(isTonAddressItemReply)
      .map((item) => toUserFriendlyAddress(item.address));

    return { accounts, chainId: Networks.TON };
  } else {
    const result = await tonInstance.connect(2, {
      manifestUrl: TONCONNECT_MANIFEST_URL,
      items: [{ name: 'ton_addr' }],
    });

    if ('items' in result.payload) {
      const accounts = result.payload?.items
        ?.filter(isTonAddressItemReply)
        .map((item) => toUserFriendlyAddress(item.address));
      return { accounts: accounts, chainId: Networks.TON };
    } else {
      throw new Error(
        result.payload?.message || 'error connecting to MyTonWallet'
      );
    }
  }
};

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    // TODO : update wallets-shared types and remove type assertions
    const tonInstance = instance as TonProvider;
    const result = await tonInstance.restoreConnection();
    if ('items' in result.payload) {
      const accounts = result.payload?.items;
      return !!(accounts && accounts.length);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const ton = tonBlockchain(allBlockChains);
  return {
    name: 'MyTonWallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/291374d3f0587e92cf5e43586e2761084b8ccc66/assets/icons/wallets/mytonwallet.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/mytonwallet-%C2%B7-my-ton-wall/fldfpgipfncgndfolcbkdeeknbbbnhcc',
      DEFAULT: 'https://mytonwallet.io/',
    },
    color: '#fff',
    supportedChains: ton,
  };
};
