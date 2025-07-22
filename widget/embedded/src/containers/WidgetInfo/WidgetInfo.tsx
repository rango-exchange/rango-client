import type { WidgetInfoContextInterface } from './WidgetInfo.types';

import { useManager } from '@arlert-dev/queue-manager-react';
import React, { createContext, useContext } from 'react';

import { useLanguage } from '../../hooks/useLanguage';
import { useUpdateQuoteInputs } from '../../hooks/useUpdateQuoteInputs/useUpdateQuoteInputs';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useQuoteStore } from '../../store/quote';
import { tabManager, useUiStore } from '../../store/ui';
import { calculateWalletUsdValue } from '../../utils/wallets';

import { WidgetHistory } from './WidgetInfo.helpers';

export const WidgetInfoContext = createContext<
  WidgetInfoContextInterface | undefined
>(undefined);

export function WidgetInfo(props: React.PropsWithChildren) {
  const { manager } = useManager();
  const isActiveTab = useUiStore.use.isActiveTab();
  const retrySwap = useQuoteStore.use.retry();
  const {
    findToken,
    getBalances,
    getConnectedWalletsDetails,
    fetchBalances: refetch,
  } = useAppStore();

  const history = new WidgetHistory(manager, { retrySwap, findToken });
  const { fetchingWallets: isLoading } = useAppStore();
  const totalBalance = calculateWalletUsdValue(getBalances());
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const swappers = useAppStore().swappers();
  const loadingStatus = useAppStore().fetchStatus;
  const resetLanguage = useLanguage().resetLanguage;
  const notifications = useNotificationStore().getNotifications();
  const clearNotifications = useNotificationStore().clearNotifications;
  const updateQuoteInputs = useUpdateQuoteInputs();
  const { fromBlockchain, toBlockchain, fromToken, toToken, inputAmount } =
    useQuoteStore();

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: WidgetInfoContextInterface = {
    isActiveTab,
    setCurrentTabAsActive: tabManager.forceClaim,
    history,
    wallets: {
      isLoading,
      details: getConnectedWalletsDetails(),
      totalBalance,
      refetch: async (accounts) => refetch(accounts),
    },
    meta: {
      blockchains,
      tokens,
      swappers,
      loadingStatus,
      findToken,
    },
    resetLanguage,
    notifications: {
      list: notifications,
      clearAll: clearNotifications,
    },
    quote: {
      quoteInputs: {
        fromBlockchain: fromBlockchain?.name ?? null,
        fromToken: fromToken
          ? {
              symbol: fromToken.symbol,
              blockchain: fromToken.blockchain,
              address: fromToken.address,
            }
          : null,
        toBlockchain: toBlockchain?.name ?? null,
        toToken: toToken
          ? {
              symbol: toToken.symbol,
              blockchain: toToken.blockchain,
              address: toToken.address,
            }
          : null,
        requestAmount: inputAmount,
      },
      updateQuoteInputs,
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
