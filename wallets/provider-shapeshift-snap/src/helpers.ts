import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import {
  getCoinbaseInstance,
  Networks,
  walletInvokeSnap,
  walletRequestSnaps,
} from '@rango-dev/wallets-shared';

export const DEFAULT_SNAP_ID = 'npm:@shapeshiftoss/metamask-snaps';
export const SNAP_VERSION = '1.0.0';

export const SHAPESHIFT_SNAP_SUPPORTED_CHAINS = [
  Networks.BTC,
  Networks.BCH,
  Networks.LTC,
];

const snapNetworksConfig: {
  chainId: Networks;
  method: string;
  params: {
    addressParams: {
      coin: string;
      addressNList: number[];
      scriptType: string;
    };
  };
}[] = [
  {
    chainId: Networks.BTC,
    method: 'btc_getPublicKeys',
    params: {
      addressParams: {
        coin: 'Bitcoin',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
        scriptType: 'p2pkh',
      },
    },
  },
  {
    chainId: Networks.BCH,
    method: 'bch_getPublicKeys',
    params: {
      addressParams: {
        coin: 'BitcoinCash',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0, 0, 0],
        scriptType: 'p2pkh',
      },
    },
  },
  {
    chainId: Networks.LTC,
    method: 'ltc_getPublicKeys',
    params: {
      addressParams: {
        coin: 'Litecoin',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0, 0, 0],
        scriptType: 'p2pkh',
      },
    },
  },
];

export function metamask() {
  const isCoinbaseWalletAvailable = !!getCoinbaseInstance();
  const { ethereum } = window;

  // Some wallets overriding the metamask. So we need to get it properly.
  if (isCoinbaseWalletAvailable) {
    // Getting intance from overrided structure from coinbase.
    return getCoinbaseInstance('metamask');
  }
  if (!!ethereum && ethereum.isMetaMask) {
    return ethereum;
  }

  return null;
}

export const installSnap = async (instance: any) => {
  return walletRequestSnaps({
    instance,
    snapId: DEFAULT_SNAP_ID,
    version: '1.0.0',
  });
};

export const getAccounts = async (
  instance: any
): Promise<ProviderConnectResult[]> => {
  const accountPromises = snapNetworksConfig.map(async (item) => {
    const address = await walletInvokeSnap({
      instance,
      params: {
        snapId: DEFAULT_SNAP_ID,
        request: {
          method: item.method,
          params: item.params,
        },
      },
    });

    return {
      accounts: [address?.[0]?.xpub],
      chainId: item.chainId,
    };
  });

  const accounts = await Promise.all(accountPromises);
  // return accounts;

  console.log(accounts);

  return [];
};
