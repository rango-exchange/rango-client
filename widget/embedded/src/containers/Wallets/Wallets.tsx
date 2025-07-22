import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { ProvidersOptions } from '../../utils/providers';
import type { LegacyEventHandler } from '@arlert-dev/wallets-core/dist/legacy/mod';
import type { PropsWithChildren } from 'react';

import { Provider } from '@arlert-dev/wallets-react';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { useWalletProviders } from '../../hooks/useWalletProviders';
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
  } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const config = useAppStore().config;

  const walletOptions: ProvidersOptions = {
    walletConnectProjectId: config?.walletConnectProjectId,
    trezorManifest: config?.trezorManifest,
    tonConnect: config.tonConnect,
    walletConnectListedDesktopWalletLink:
      props.config.__UNSTABLE_OR_INTERNAL__
        ?.walletConnectListedDesktopWalletLink,
  };
  const { providers } = useWalletProviders(config.wallets, walletOptions);
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
        onUpdateState={(type, event, value, state, info) => {
          const eventParams: Parameters<LegacyEventHandler> = [
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
