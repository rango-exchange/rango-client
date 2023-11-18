import type { MetaState } from '../store/meta';
import type { WalletType } from '@rango-dev/wallets-shared';

import { useWallets } from '@rango-dev/wallets-react';
import { useEffect, useRef } from 'react';

type forceAutoConnectParams = {
  loadingStatus: MetaState['loadingStatus'];
  walletType?: WalletType;
};

export function useForceAutoConnect(params: forceAutoConnectParams): void {
  const { loadingStatus, walletType = '' } = params;
  const { connect, state } = useWallets();
  const initiated = useRef(false);

  const walletState = state(walletType);

  useEffect(() => {
    const shouldTryConnect =
      loadingStatus === 'success' &&
      walletType &&
      walletState &&
      walletState.installed &&
      !walletState.connecting &&
      !walletState.connected;

    if (shouldTryConnect && !initiated.current) {
      initiated.current = true;
      connect(walletType)
        .then()
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, [walletState, loadingStatus]);
}
