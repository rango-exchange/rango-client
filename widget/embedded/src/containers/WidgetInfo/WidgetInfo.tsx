import type { WidgetInfoContextInterface } from './WidgetInfo.types';

import { useManager } from '@rango-dev/queue-manager-react';
import React, { createContext, useContext } from 'react';

import { useLanguage } from '../../hooks/useLanguage';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useQuoteStore } from '../../store/quote';
import { tabManager, useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { calculateWalletUsdValue } from '../../utils/wallets';

import { WidgetHistory } from './WidgetInfo.helpers';

export const WidgetInfoContext = createContext<
  WidgetInfoContextInterface | undefined
>(undefined);

export function WidgetInfo(props: React.PropsWithChildren) {
  const { manager } = useManager();
  const isActiveTab = useUiStore.use.isActiveTab();
  const retrySwap = useQuoteStore.use.retry();
  const history = new WidgetHistory(manager, { retrySwap });
  const details = useWalletsStore.use.connectedWallets();
  const isLoading = useWalletsStore.use.loading();
  const totalBalance = calculateWalletUsdValue(details);
  const refetch = useWalletsStore.use.getWalletsDetails();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const swappers = useAppStore().swappers();
  const loadingStatus = useAppStore().fetchStatus;
  const resetLanguage = useLanguage().resetLanguage;
  const notifications = useNotificationStore().getUnreadNotifications();

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: WidgetInfoContextInterface = {
    isActiveTab,
    setCurrentTabAsActive: tabManager.forceClaim,
    history,
    wallets: {
      isLoading,
      details,
      totalBalance,
      refetch,
    },
    meta: {
      blockchains,
      tokens,
      swappers,
      loadingStatus,
    },
    resetLanguage,
    notifications: {
      list: notifications,
    },
  };

  return (
    <WidgetInfoContext.Provider value={value}>
      {props.children}
    </WidgetInfoContext.Provider>
  );
}

export function useWidget(): WidgetInfoContextInterface {
  const context = useContext(WidgetInfoContext);
  if (!context) {
    throw new Error(
      'useWidget can only be used within the WidgetProvider component'
    );
  }
  return context;
}
