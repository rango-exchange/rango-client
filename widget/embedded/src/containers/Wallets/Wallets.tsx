import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { PropsWithChildren } from 'react';

import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { AppStoreProvider, useAppStore } from '../../store/AppStore';

import { useUpdates } from './useUpdates';
import { WalletControllerProvider } from './WalletController';

export const WidgetContext = createContext<WidgetContextInterface>({
  onConnectWallet: () => {
    return;
  },
  onDisconnectWallet: () => {
    return;
  },
});

function Main(props: PropsWithChildren<PropTypes>) {
  const {
    updateConfig,
    updateSettings,
    fetch: fetchMeta,
    fetchStatus,
    clearConnectedWallet,
  } = useAppStore();
  const config = useAppStore().config;
  const { walletController } = props.config;

  const onConnectWalletHandler = useRef<OnWalletConnectHandler>();
  const onDisconnectWalletHandler = useRef<OnWalletDisconnectHandler>();
  const { handler: handleEvent } = useUpdates({
    onConnectWalletHandler,
    onDisconnectWalletHandler,
  });

  useEffect(() => {
    void fetchMeta().catch(console.log);
  }, []);

  useEffect(() => {
    if (props.config) {
      updateConfig(props.config);
      updateSettings(props.config);
      window['__rango'] = {
        config,
        dappConfig: props.config,
      };
    }
  }, [props.config, fetchStatus]);

  // Connected wallets belong to the host's providers, so they're reset when they change.
  useEffect(() => {
    clearConnectedWallet();
  }, [props.config.wallets.map((provider) => provider.id).join('-')]);

  const handlers = useMemo(
    () => ({
      onConnectWallet: (handler: OnWalletConnectHandler) => {
        onConnectWalletHandler.current = handler;
      },
      onDisconnectWallet: (handler: OnWalletDisconnectHandler) => {
        onDisconnectWalletHandler.current = handler;
      },
    }),
    []
  );

  return (
    <WidgetContext.Provider value={handlers}>
      <WalletControllerProvider
        controller={walletController}
        onEvent={handleEvent}>
        {props.children}
      </WalletControllerProvider>
    </WidgetContext.Provider>
  );
}

export function Wallets(props: PropsWithChildren<PropTypes>) {
  const { config, ...otherProps } = props;
  return (
    <AppStoreProvider config={config}>
      <Main {...otherProps} config={config} />
    </AppStoreProvider>
  );
}
