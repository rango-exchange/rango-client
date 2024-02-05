import type { WalletType } from '@rango-dev/wallets-shared';

import { I18nManager } from '@rango-dev/ui';
import React, { useContext, useEffect, useState } from 'react';

import { AppRouter } from '../../components/AppRouter';
import { AppRoutes } from '../../components/AppRoutes';
import { WidgetEvents } from '../../components/WidgetEvents';
import { globalFont } from '../../globalStyles';
import { useFetchApiConfig } from '../../hooks/useFetchApiConfig';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { WidgetContext } from '../Wallets';

import { MainContainer } from './App.styles';

export function Main() {
  globalFont();

  const { config } = useAppStore();
  const { activeTheme } = useTheme(config?.theme || {});
  const { activeLanguage } = useLanguage();
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const widgetContext = useContext(WidgetContext);
  const { fetchApiConfig } = useFetchApiConfig();
  useEffect(() => {
    void useNotificationStore.persist.rehydrate();
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
    void fetchApiConfig().catch(console.log);
  }, []);

  return (
    <I18nManager language={activeLanguage}>
      <MainContainer id="swap-container" className={activeTheme()}>
        <WidgetEvents />
        <AppRouter
          lastConnectedWallet={lastConnectedWalletWithNetwork}
          disconnectedWallet={disconnectedWallet}
          clearDisconnectedWallet={() => {
            setDisconnectedWallet(undefined);
          }}>
          <AppRoutes />
        </AppRouter>
      </MainContainer>
    </I18nManager>
  );
}
