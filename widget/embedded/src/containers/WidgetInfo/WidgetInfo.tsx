import type { WidgetInfoContextInterface } from './WidgetInfo.types';

import { useManager } from '@rango-dev/queue-manager-react';
import React, { createContext, useContext } from 'react';

import { useWalletsStore } from '../../store/wallets';
import { calculateWalletUsdValue } from '../../utils/wallets';

import { WidgetHistory } from './WidgetInfo.helpers';

export const WidgetInfoContext = createContext<
  WidgetInfoContextInterface | undefined
>(undefined);

export function WidgetInfo(props: React.PropsWithChildren) {
  const { manager } = useManager();
  const history = new WidgetHistory(manager);
  const details = useWalletsStore.use.connectedWallets();
  const isLoading = useWalletsStore.use.loading();
  const totalBalance = calculateWalletUsdValue(details);
  const refetch = useWalletsStore.use.getWalletsDetails();
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    history,
    wallets: {
      isLoading,
      details,
      totalBalance,
      refetch,
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
