import type { WidgetConfig } from '../types';
import type { PropsWithChildren } from 'react';

import React, { createContext, useContext, useEffect, useRef } from 'react';

import { createAppStore } from './app';

type AppStore = ReturnType<typeof createAppStore>;
type AppStoreProviderProps = PropsWithChildren<{ config?: WidgetConfig }>;

export const AppStoreContext = createContext<AppStore | null>(null);

export function useAppStore() {
  const store = useContext(AppStoreContext);

  useEffect(() => {
    if (store && !store.persist.hasHydrated()) {
      void store.persist.rehydrate();
    }
  }, []);

  if (!store) {
    throw new Error('Missing AppStoreContext.Provider in the tree');
  }

  return store();
}

export function AppStoreProvider(props: AppStoreProviderProps) {
  const appStoreRef = useRef<AppStore>();

  if (!appStoreRef.current) {
    appStoreRef.current = createAppStore(props.config);
  }

  return (
    <AppStoreContext.Provider value={appStoreRef.current}>
      {props.children}
    </AppStoreContext.Provider>
  );
}
