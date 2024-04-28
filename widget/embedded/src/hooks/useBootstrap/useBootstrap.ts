import type { WalletType } from '../..';

import { useQueueManager } from '@rango-dev/queue-manager-rango-preset';
import { splitWalletNetwork } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-sdk';
import { useContext, useEffect, useState } from 'react';

import { useWallets } from '../..';
import { WidgetContext } from '../../containers/Wallets';
import { globalFont } from '../../globalStyles';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { tabManager } from '../../store/ui';
import { useFetchApiConfig } from '../useFetchApiConfig';
import { useForceAutoConnect } from '../useForceAutoConnect';
import { useSubscribeToWidgetEvents } from '../useSubscribeToWidgetEvents';

export function useBootstrap() {
  globalFont();
  useForceAutoConnect();
  useSubscribeToWidgetEvents();
  const blockchains = useAppStore().blockchains();
  const { canSwitchNetworkTo } = useWallets();
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const widgetContext = useContext(WidgetContext);

  const evmChains = blockchains.filter(isEvmBlockchain);

  const { fetchApiConfig } = useFetchApiConfig();

  // At the moment, we only detect the disconnection of EVM wallets.
  useQueueManager({
    lastConnectedWallet: lastConnectedWalletWithNetwork,
    clearDisconnectedWallet: () => {
      setDisconnectedWallet(undefined);
    },
    disconnectedWallet: disconnectedWallet,
    evmChains,
    canSwitchNetworkTo,
  });

  useEffect(() => {
    tabManager.init();

    if (!useNotificationStore.persist.hasHydrated()) {
      void useNotificationStore.persist.rehydrate();
    }

    /**
     * Add handlers to the widget context for connecting and disconnecting wallets.
     * We pass these handlers to the wallet provider to keep track of the last connected and last disconnected wallets.
     * The 'queue-manager' uses these details to spot any changes in the connection status of the required wallet during the swap process.
     *
     * with this approch anyone who use the widget context can override these handlers and causes some bugs happens.
     * it the future we should add a safer soloution like considering array of handlers .
     * https://github.com/rango-exchange/rango-client/pull/630/files#r1518846728
     */
    widgetContext.onConnectWallet((walletType) => {
      setLastConnectedWalletWithNetwork(walletType);
    });
    widgetContext.onDisconnectWallet((walletType) => {
      setDisconnectedWallet(walletType);
      if (
        walletType === splitWalletNetwork(lastConnectedWalletWithNetwork)?.[0]
      ) {
        setLastConnectedWalletWithNetwork('');
      }
    });

    void fetchApiConfig().catch(console.log);

    return tabManager.destroy;
  }, [lastConnectedWalletWithNetwork]);
}
