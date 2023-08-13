import type { WidgetConfig } from './types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { I18nManager, styled, SwapContainer } from '@rango-dev/ui';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { AppRouter } from './components/AppRouter';
import { AppRoutes } from './components/AppRoutes';
import { WidgetEvents } from './components/WidgetEvents';
import { navigationRoutes } from './constants/navigationRoutes';
import { globalFont } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import QueueManager from './QueueManager';
import { useUiStore } from './store/ui';
import { initConfig } from './utils/configs';
import { WidgetContext, WidgetWallets } from './Wallets';

const MainContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export type WidgetProps = {
  config?: WidgetConfig;
};

export function Main(props: PropsWithChildren<WidgetProps>) {
  const { config } = props;
  globalFont(config?.theme?.fontFamily || 'Roboto');

  const { activeTheme } = useTheme(config?.theme || {});
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const currentPage = useUiStore.use.currentPage();
  const widgetContext = useContext(WidgetContext);

  useMemo(() => {
    if (config?.apiKey) {
      initConfig({
        API_KEY: config?.apiKey,
      });
    }
  }, [config]);

  useEffect(() => {
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
  }, []);

  return (
    <I18nManager language={config?.language}>
      <MainContainer id="swap-container" className={activeTheme}>
        <QueueManager>
          <WidgetEvents />
          <SwapContainer fixedHeight={currentPage !== navigationRoutes.home}>
            <AppRouter
              lastConnectedWallet={lastConnectedWalletWithNetwork}
              disconnectedWallet={disconnectedWallet}
              clearDisconnectedWallet={() => {
                setDisconnectedWallet(undefined);
              }}>
              <AppRoutes config={config} />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </MainContainer>
    </I18nManager>
  );
}

export function Widget(props: PropsWithChildren<WidgetProps>) {
  if (!props.config?.externalWallets) {
    return (
      <WidgetWallets
        providers={props.config?.wallets}
        options={{
          walletConnectProjectId: props.config?.walletConnectProjectId,
        }}>
        <Main {...props} />
      </WidgetWallets>
    );
  }
  return <Main {...props} />;
}
