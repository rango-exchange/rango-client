import { useWallets } from '@rango-dev/wallets-react';
import { useEffect, useRef } from 'react';

import { SearchParams } from '../constants/searchParams';
import { useAppStore } from '../store/AppStore';

export function useForceAutoConnect(): void {
  const { connect, state } = useWallets();
  const initiated = useRef<{ [key: string]: boolean }>({});
  const { fetchStatus } = useAppStore();
  const walletType =
    new URLSearchParams(location.search).get(SearchParams.AUTO_CONNECT) || '';
  const walletState = state(walletType);

  useEffect(() => {
    const shouldTryConnect =
      fetchStatus === 'success' &&
      walletType &&
      walletState.installed &&
      !walletState.connecting &&
      !walletState.connected;
    if (shouldTryConnect && !initiated.current[walletType]) {
      initiated.current[walletType] = true;
      void connect(walletType);
    }
  }, [walletState, fetchStatus]);
}
