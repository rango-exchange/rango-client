import type { AccContract } from './types';

import { getCoinbaseInstance } from '@rango-dev/wallets-shared';

export const DEFAULT_SNAP_ID = 'npm:@consensys/starknet-snap';
export const SNAP_VERSION = '2.2.0';

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
export const isStarknetSnapInstalled = async (instance: any) =>
  instance
    .request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: DEFAULT_SNAP_ID,
        request: {
          method: 'ping',
        },
      },
    })
    .then(() => {
      return true;
    })
    .catch((err: any) => {
      console.log(err);
      return false;
    });

export const installStarknetSnap = async (instance: any) => {
  const installed = await isStarknetSnapInstalled(instance);
  if (!installed) {
    instance.request({
      method: 'wallet_requestSnaps',
      params: {
        [DEFAULT_SNAP_ID]: { version: SNAP_VERSION }, //Snap's version
      },
    });
  }
};

export const getAccounts = async (
  instance: any,
  chainId: string
): Promise<AccContract[]> => {
  const START_SCAN_INDEX = 0;
  const MAX_SCANNED = 1;
  const MAX_MISSED = 1;
  const scannedAccounts = await instance.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'starkNet_recoverAccounts',
        params: {
          startScanIndex: START_SCAN_INDEX,
          maxScanned: MAX_SCANNED,
          maxMissed: MAX_MISSED,
          chainId,
        },
      },
    },
  });
  return scannedAccounts;
};
