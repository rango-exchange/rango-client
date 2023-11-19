import type { WalletType } from '@rango-dev/wallets-shared';

import { I18nManager } from '@rango-dev/ui';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { AppRouter } from '../../components/AppRouter';
import { AppRoutes } from '../../components/AppRoutes';
import { WidgetEvents } from '../../components/WidgetEvents';
import { globalFont } from '../../globalStyles';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useSettingsStore } from '../../store/settings';
import { initConfig } from '../../utils/configs';
import { WidgetContext } from '../Wallets';

import { MainContainer } from './App.styles';

export function Main() {
  globalFont();

  const { fetch: fetchMeta, config } = useAppStore();
  const { activeTheme } = useTheme(config?.theme || {});
  const { activeLanguage, changeLanguage } = useLanguage();
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const widgetContext = useContext(WidgetContext);

  useMemo(() => {
    if (config?.apiKey) {
      initConfig({
        API_KEY: config?.apiKey,
      });
    }
  }, [config]);
  useEffect(() => {
    void fetchMeta().catch();
    void useSettingsStore.persist.rehydrate();
    void useNotificationStore.persist.rehydrate();
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
  }, []);
  useEffect(() => {
    if (config?.language) {
      changeLanguage(config.language);
    }
  }, [config?.language]);

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
