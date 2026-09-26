import type { ProviderContext } from '@rango-dev/wallets-react';

import { useWallets } from '@rango-dev/wallets-react';
import { useContext } from 'react';

import { WidgetContext } from '../containers/Wallets';

/** `useWallets().connect`, reporting the requested namespaces to wallet analytics first. */
export function useConnectWallet(): ProviderContext['connect'] {
  const { connect } = useWallets();
  const { walletAnalyticsTracker } = useContext(WidgetContext);

  return async (type, namespaces) => {
    walletAnalyticsTracker?.handleConnectRequest(type, namespaces);
    return connect(type, namespaces);
  };
}
