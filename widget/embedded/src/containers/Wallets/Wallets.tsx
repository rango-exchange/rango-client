import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { EventHandler } from '@rango-dev/wallets-react';
import type { PropsWithChildren } from 'react';

import { Provider } from '@rango-dev/wallets-react';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { eventEmitter } from '../../services/eventEmitter';
import { AppStoreProvider, useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';

import { useUpdates } from './useUpdates';
import { propagateEvents } from './Wallets.helpers';

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
  const blockchains = useAppStore().blockchains();
  const config = useAppStore().config;

  // From the store, like `useWalletList`, so the list never asks for a wallet the engine has already dropped.
  const providers = config.wallets;
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
  }, [providers.map((provider) => provider.id).join('-')]);

  const isActiveTab = useUiStore.use.isActiveTab();

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
      <Provider
        allBlockChains={blockchains}
        providers={providers}
        emitter={eventEmitter}
        onUpdateState={(type, event, value, state, info) => {
          const eventParams: Parameters<EventHandler> = [
            type,
            event,
            value,
            state,
            info,
          ];
          handleEvent(...eventParams);

          if (props.onUpdateState) {
            propagateEvents(props.onUpdateState, eventParams);
          }
        }}
        autoConnect={!!isActiveTab}
        configs={{
          wallets: config.wallets,
        }}>
        {props.children}
      </Provider>
    </WidgetContext.Provider>
  );
}

export function WidgetWallets(props: PropsWithChildren<PropTypes>) {
  const { config, ...otherProps } = props;
  return (
    <AppStoreProvider config={config}>
      <Main {...otherProps} config={config} />
    </AppStoreProvider>
  );
}
