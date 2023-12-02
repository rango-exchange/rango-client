import type { WidgetInfoContextInterface } from './WidgetInfo.types';

import { useManager } from '@rango-dev/queue-manager-react';
import React, { createContext, useContext } from 'react';

import { useWalletsStore } from '../../store/wallets';
import { getPendingSwaps } from '../../utils/queue';
import { calculateWalletUsdValue } from '../../utils/wallets';

export const WidgetInfoContext = createContext<
  WidgetInfoContextInterface | undefined
>(undefined);

export function WidgetInfo(props: React.PropsWithChildren) {
  const { manager } = useManager();
  const swaps = getPendingSwaps(manager);
  const details = useWalletsStore.use.connectedWallets();
  const isLoading = useWalletsStore.use.loading();
  const totalBalance = calculateWalletUsdValue(details);
  const refetch = useWalletsStore.use.getWalletsDetails();
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    swaps,
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
