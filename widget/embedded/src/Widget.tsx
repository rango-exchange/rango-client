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
import { useBestRouteStore } from './store/bestRoute';
import { useMetaStore } from './store/meta';
import { useNotificationStore } from './store/notification';
import { useSettingsStore } from './store/settings';
import { initConfig } from './utils/configs';
import { tokensAreEqual } from './utils/wallets';
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
  '& *:focus-visible': {
    outline: '1px $info500 solid',
    transition: 'none',
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

  const {
    setInputAmount,
    setToToken,
    setToBlockchain,
    setFromBlockchain,
    setFromToken,
  } = useBestRouteStore();

  const {
    meta: { tokens, blockchains },
    loadingStatus: loadingMetaStatus,
  } = useMetaStore();

  const { setAffiliateRef, setAffiliatePercent, setAffiliateWallets } =
    useSettingsStore();

  useEffect(() => {
    setInputAmount(config?.amount?.toString() || '');
  }, [config?.amount]);

  useEffect(() => {
    if (loadingMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.from?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.from?.token || null)
      );

      setFromBlockchain(chain || null);
      setFromToken(token || null);
    }
  }, [config?.from?.token, config?.from?.blockchain, loadingMetaStatus]);

  useEffect(() => {
    if (loadingMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.to?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.to?.token || null)
      );
      setToBlockchain(chain || null);
      setToToken(token || null);
    }
  }, [config?.to?.token, config?.to?.blockchain, loadingMetaStatus]);

  useEffect(() => {
    setAffiliateRef(config?.affiliate?.ref ?? null);
    setAffiliatePercent(config?.affiliate?.percent ?? null);
    setAffiliateWallets(config?.affiliate?.wallets ?? null);
  }, [
    config?.affiliate?.ref,
    config?.affiliate?.percent,
    config?.affiliate?.wallets,
  ]);

  return (
    <I18nManager language={config?.language}>
      <MainContainer id="swap-container" className={activeTheme}>
        <QueueManager>
          <WidgetEvents />
          <AppRouter
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
