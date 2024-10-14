import type {
  OnWalletConnectionChange,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { ProvidersOptions } from '../../utils/providers';
import type { LegacyEventHandler as EventHandler } from '@rango-dev/wallets-core/legacy';
import type { PropsWithChildren } from 'react';

import { Events, Provider } from '@rango-dev/wallets-react';
import { type Network } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-sdk';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { useWalletProviders } from '../../hooks/useWalletProviders';
import { AppStoreProvider, useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { isFeatureEnabled } from '../../utils/settings';
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
  const { newWalletConnected, disconnectWallet } = useAppStore();
  const config = useAppStore().config;

  const walletOptions: ProvidersOptions = {
    walletConnectProjectId: config?.walletConnectProjectId,
    trezorManifest: config?.trezorManifest,
    walletConnectListedDesktopWalletLink:
      props.config.__UNSTABLE_OR_INTERNAL__
        ?.walletConnectListedDesktopWalletLink,
    experimentalWallet: props.config.features?.experimentalWallet,
  };
  const { providers } = useWalletProviders(config.wallets, walletOptions);
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
          void newWalletConnected(data);
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
    if (
      (event === Events.ACCOUNTS && state.connected) ||
      // Hub works differently, and this check should be enough.
      (event === Events.ACCOUNTS && meta.isHub)
    ) {
      const key = `${type}-${state.network}-${value}`;

      if (!!onConnectWalletHandler.current) {
        onConnectWalletHandler.current(key);
      } else {
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
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
        autoConnect={!!isActiveTab}
        configs={{
          isExperimentalEnabled: isFeatureEnabled(
            'experimentalWallet',
            props.config.features
          ),
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
