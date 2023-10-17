import type { WidgetConfig } from './types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { I18nManager, styled } from '@rango-dev/ui';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { AppRouter } from './components/AppRouter';
import { AppRoutes } from './components/AppRoutes';
import { WidgetEvents } from './components/WidgetEvents';
import { globalFont } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import QueueManager from './QueueManager';
import { useAppStore } from './store/app';
import { useNotificationStore } from './store/notification';
import { useSettingsStore } from './store/settings';
import { initConfig } from './utils/configs';
import { WidgetContext, WidgetWallets } from './Wallets';

const MainContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '$widget',
  boxSizing: 'border-box',
  '& *, *::before, *::after': {
    boxSizing: 'inherit',
    listStyleType: 'none',
  },
});

export type WidgetProps = {
  config?: WidgetConfig;
};

export function Main(props: PropsWithChildren<WidgetProps>) {
  const { config } = props;
  globalFont();

  const { activeTheme } = useTheme(config?.theme || {});
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
    void useSettingsStore.persist.rehydrate();
    void useNotificationStore.persist.rehydrate();
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
  }, []);

  return (
    <I18nManager language={config?.language}>
      <MainContainer id="swap-container" className={activeTheme}>
        <QueueManager>
          <WidgetEvents />
          <AppRouter
            config={config}
            lastConnectedWallet={lastConnectedWalletWithNetwork}
            disconnectedWallet={disconnectedWallet}
            clearDisconnectedWallet={() => {
              setDisconnectedWallet(undefined);
            }}>
            <AppRoutes config={config} />
          </AppRouter>
        </QueueManager>
      </MainContainer>
    </I18nManager>
  );
}

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const { updateConfig, config } = useAppStore();
  useEffect(() => {
    if (props.config) {
      updateConfig(props.config);
    }
  }, [props.config]);

  if (!props.config?.externalWallets) {
    return (
      <WidgetWallets
        providers={config?.wallets}
        options={{
          walletConnectProjectId: config?.walletConnectProjectId,
        }}>
        <Main {...props} />
      </WidgetWallets>
    );
  }
  return <Main {...props} />;
}
