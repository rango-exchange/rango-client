import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { WalletControllerEventHandler } from '../../types/walletController';
import type { ProvidersOptions } from '../../utils/providers';
import type { EventHandler } from '@rango-dev/wallets-react';
import type { PropsWithChildren } from 'react';

import { WalletTypes } from '@rango-dev/provider-all';
import { Provider } from '@rango-dev/wallets-react';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { useWalletProviders } from '../../hooks/useWalletProviders';
import { eventEmitter } from '../../services/eventEmitter';
import { AppStoreProvider, useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';

import { useUpdates } from './useUpdates';
import {
  createWalletEvents,
  WalletControllerProvider,
  WalletControllerScope,
} from './WalletController';
import { propagateEvents } from './Wallets.helpers';

export const WidgetContext = createContext<WidgetContextInterface>({
  onConnectWallet: () => {
    return;
  },
  onDisconnectWallet: () => {
    return;
  },
});

/**
 * Used when the host app doesn't pass `config.walletController`: the widget runs wallets-react itself.
 */
function InternalWallets(
  props: PropsWithChildren<
    Pick<PropTypes, 'config' | 'onUpdateState'> & {
      onEvent: WalletControllerEventHandler;
    }
  >
) {
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
  const walletEvents = useMemo(createWalletEvents, []);
  const isActiveTab = useUiStore.use.isActiveTab();

  return (
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
        walletEvents.emit(...eventParams);

        if (props.onUpdateState) {
          propagateEvents(props.onUpdateState, eventParams);
        }
      }}
      autoConnect={!!isActiveTab}
      configs={{
        wallets: config.wallets,
        walletOptions: {
          [WalletTypes.TON_CONNECT]: {
            provider: { manifestUrl: config.tonConnect?.manifestUrl },
          },
          [WalletTypes.OKX]: {
            provider: {
              tonConnectManifestUrl: config.tonConnect?.manifestUrl,
            },
          },
          [WalletTypes.TREZOR]: {
            provider: { manifest: config.trezorManifest },
          },
          [WalletTypes.WALLET_CONNECT_2]: {
            provider: {
              WC_PROJECT_ID: config.walletConnectProjectId || '',
              DISABLE_MODAL_AND_OPEN_LINK:
                config.__UNSTABLE_OR_INTERNAL__
                  ?.walletConnectListedDesktopWalletLink,
              meta: blockchains,
            },
          },
          [WalletTypes.LEDGER_WALLET]: {
            provider: config.ledgerWallet,
          },
        },
      }}>
      <WalletControllerScope events={walletEvents} onEvent={props.onEvent}>
        {props.children}
      </WalletControllerScope>
    </Provider>
  );
}

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
  const walletIds = (props.config.wallets ?? [])
    .map((wallet) =>
      typeof wallet === 'string'
        ? wallet
        : 'id' in wallet
        ? wallet.id
        : wallet.config.type
    )
    .join('-');
  useEffect(() => {
    if (walletController) {
      clearConnectedWallet();
    }
  }, [walletIds]);

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
      {walletController ? (
        <WalletControllerProvider
          controller={walletController}
          onEvent={handleEvent}>
          {props.children}
        </WalletControllerProvider>
      ) : (
        <InternalWallets
          config={props.config}
          onUpdateState={props.onUpdateState}
          onEvent={handleEvent}>
          {props.children}
        </InternalWallets>
      )}
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
