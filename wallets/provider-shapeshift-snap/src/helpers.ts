import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import {
  getCoinbaseInstance,
  Networks,
  walletInvokeSnap,
  walletRequestSnaps,
} from '@rango-dev/wallets-shared';

export const DEFAULT_SNAP_ID = 'npm:@shapeshiftoss/metamask-snaps';
export const DEFAULT_SNAP_VERSION = '1.0.0';

export const SHAPESHIFT_SNAP_SUPPORTED_CHAINS = [
  Networks.BTC,
  Networks.BCH,
  Networks.COSMOS,
  Networks.OSMOSIS,
  Networks.DOGE,
  Networks.ETHEREUM,
  Networks.LTC,
  Networks.THORCHAIN,
];

const snapNetworksConfig: {
  chainId: string;
  method: string;
  params: {
    addressParams: {
      coin?: string;
      addressNList?: number[];
      scriptType?: string;
    };
  };
}[] = [
  {
    chainId: Networks.BTC,
    method: 'btc_getAddress',
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
    method: 'bch_getAddress',
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
    method: 'ltc_getAddress',
    params: {
      addressParams: {
        coin: 'Litecoin',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0, 0, 0],
        scriptType: 'p2pkh',
      },
    },
  },
  /*
   * {
   *   chainId: Networks.DOGE,
   *   method: 'doge_getAddress',
   *   params: {
   *     addressParams: {
   *       coin: 'Dogecoin',
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0, 0, 0],
   *       scriptType: 'p2pkh',
   *     },
   *   },
   * },
   */
  /*
   * {
   *   chainId: Networks.BINANCE,
   *   method: 'binance_getAddress',
   *   params: {
   *     addressParams: {
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0, 0],
   *     },
   *   },
   * },
   */

  {
    chainId: Networks.COSMOS,
    method: 'cosmos_getAddress',
    params: {
      addressParams: {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
      },
    },
  },
  /*
   * {
   *   chainId: Networks.ETHEREUM,
   *   method: 'eth_getAddress',
   *   params: {
   *     addressParams: {
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 0],
   *     },
   *   },
   * },
   */
  {
    chainId: 'osmosis-1',
    method: 'osmosis_getAddress',
    params: {
      addressParams: {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
      },
    },
  },
  /*
   * {
   *   chainId: Networks.SECRET,
   *   method: 'secret_getAddress',
   *   params: {
   *     addressParams: {
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 529, 0x80000000 + 0, 0, 0],
   *     },
   *   },
   * },
   */
  /*
   * {
   *   chainId: Networks.TERRA,
   *   method: 'terra_getAddress',
   *   params: {
   *     addressParams: {
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 330, 0x80000000 + 0, 0, 0],
   *     },
   *   },
   * },
   */
  {
    chainId: Networks.THORCHAIN,
    method: 'thorchain_getAddress',
    params: {
      addressParams: {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
      },
    },
  },
  /*
   * {
   *   chainId: Networks.AVAX_CCHAIN,
   *   method: 'avax_getAddress',
   *   params: {
   *     addressParams: {
   *       // eslint-disable-next-line @typescript-eslint/no-magic-numbers
   *       addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 0],
   *     },
   *   },
   * },
   */
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
    version: DEFAULT_SNAP_VERSION,
  });
};

export const getAccounts = async (
  instance: any
): Promise<ProviderConnectResult[]> => {
  const MAX_CONCURRENT_REQUESTS = 4; // Implemented this way to revent following error: "Exceeds maximum number of requests waiting to be resolved"

  const resolvedAccounts: ProviderConnectResult[] = [];
  let index = 0;

  while (index < snapNetworksConfig.length) {
    const batchConfigs = snapNetworksConfig.slice(
      index,
      index + MAX_CONCURRENT_REQUESTS
    );
    const batchPromises = batchConfigs.map(async (item) => {
      let address: string = await walletInvokeSnap({
        instance,
        params: {
          snapId: DEFAULT_SNAP_ID,
          request: {
            method: item.method,
            params: item.params,
          },
        },
      });

      if (address.includes(':')) {
        address = address.split(':')[1]; // this line is here because bitcoin cash address returns like "bitcoincash:..."
      }

      return {
        accounts: [address],
        chainId: item.chainId,
      };
    });
    const availableAccountForChains = await Promise.allSettled(batchPromises);

    availableAccountForChains.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { accounts, chainId } = result.value;
        resolvedAccounts.push({ accounts, chainId });
      }
    });

    index += MAX_CONCURRENT_REQUESTS;
  }

  return resolvedAccounts;
};
