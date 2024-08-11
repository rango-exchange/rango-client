import type {
  OnWalletConnectionChange,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { ProvidersOptions } from '../../utils/providers';
import type { EventHandler } from '@rango-dev/wallets-react';
import type { PropsWithChildren } from 'react';

import { Events, Provider } from '@rango-dev/wallets-react';
import { type Network } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-sdk';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { useWalletProviders } from '../../hooks/useWalletProviders';
import { AppStoreProvider, useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from '../../utils/wallets';

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
  const { findToken } = useAppStore();
  const config = useAppStore().config;

  const walletOptions: ProvidersOptions = {
    walletConnectProjectId: config?.walletConnectProjectId,
    trezorManifest: config?.trezorManifest,
    walletConnectListedDesktopWalletLink:
      props.config.__UNSTABLE_OR_INTERNAL__
        ?.walletConnectListedDesktopWalletLink,
  };
  const { providers } = useWalletProviders(config.wallets, walletOptions);
  const { connectWallet, disconnectWallet } = useWalletsStore();
  const onConnectWalletHandler = useRef<OnWalletConnectionChange>();
  const onDisconnectWalletHandler = useRef<OnWalletConnectionChange>();

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

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (type, event, value, state, meta) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          walletAndSupportedChainsNames(meta.supportedBlockchains);
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          supportedChainNames,
          meta.isContractWallet
        );
        if (data.length) {
          connectWallet(data, findToken);
        }
      } else {
        disconnectWallet(type);
        if (!!onDisconnectWalletHandler.current) {
          onDisconnectWalletHandler.current(type);
        } else {
          console.warn(
            `onDisconnectWallet handler hasn't been set. Are you sure?`
          );
        }
      }
    }
    if (event === Events.ACCOUNTS && state.connected) {
      const key = `${type}-${state.network}-${value}`;

      if (state.connected) {
        if (!!onConnectWalletHandler.current) {
          onConnectWalletHandler.current(key);
        } else {
          console.warn(
            `onConnectWallet handler hasn't been set. Are you sure?`
          );
        }
      }
    }

    if (event === Events.NETWORK && state.network) {
      const key = `${type}-${state.network}`;
      if (!!onConnectWalletHandler.current) {
        onConnectWalletHandler.current(key);
      } else {
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
      }
    }

    // propagate updates for Dapps using external wallets
    if (props.onUpdateState) {
      props.onUpdateState(type, event, value, state, meta);
    }
  };
  const isActiveTab = useUiStore.use.isActiveTab();

  const handlers = useMemo(
    () => ({
      onConnectWallet: (handler: OnWalletConnectionChange) => {
        onConnectWalletHandler.current = handler;
      },
      onDisconnectWallet: (handler: OnWalletConnectionChange) => {
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
        onUpdateState={onUpdateState}
        autoConnect={!!isActiveTab}>
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
