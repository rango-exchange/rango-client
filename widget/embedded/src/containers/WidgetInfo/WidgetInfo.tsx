import type { WidgetInfoContextInterface } from './WidgetInfo.types';

import { useManager } from '@rango-dev/queue-manager-react';
import React, { createContext, useContext, useMemo } from 'react';

import { getPendingSwaps } from '../../utils/queue';

export const WidgetInfoContext = createContext<
  WidgetInfoContextInterface | undefined
>(undefined);

export function WidgetInfo(props: React.PropsWithChildren) {
  const { manager } = useManager();
  const swaps = getPendingSwaps(manager);
  const value = useMemo(() => {
    return {
      swaps,
    };
  }, [manager, swaps]);

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
