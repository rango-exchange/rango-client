import type {
  OnWalletConnectionChange,
  PropTypes,
  WidgetContextInterface,
} from './Wallets.types';
import type { ProvidersOptions } from '../../utils/providers';
import type { LegacyEventHandler as EventHandler } from '@rango-dev/wallets-core/legacy';
import type { PropsWithChildren } from 'react';

import {
  legacyFormatAddressWithNetwork as formatAddressWithNetwork,
  legacyReadAccountAddress as readAccountAddress,
} from '@rango-dev/wallets-core/legacy';
import { Events, Provider } from '@rango-dev/wallets-react';
import { type Network } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-sdk';
import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { useWalletProviders } from '../../hooks/useWalletProviders';
import { AppStoreProvider, useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
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
    removeBalancesForWallet,
  } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const { newWalletConnected, disconnectWallet, connectedWallets } =
    useAppStore();
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

  const onUpdateState: EventHandler = (type, event, value, state, info) => {
    if (event === Events.NAMESPACE_DISCONNECTED) {
      removeBalancesForWallet(type, {
        namespaces: value,
      });
    }

    if (event === Events.ACCOUNTS) {
      const supportedChainNames: Network[] | null =
        walletAndSupportedChainsNames(info.supportedBlockchains);

      /*
       * When a wallet is connecting to an evm account, we will consider it as the account exists on other evm-compatible blockchains
       * To get their balances.
       *
       * The logic here is for handling switching account functionality in wallets. when a wallet is switching to another account
       * we need to clean the balances for old accounts.
       *
       * Note: hub will do the cleanup on namespace diconnected event.
       */
      if (!info.isHub) {
        const evmAccounts: string[] = [];
        const nonEvmAccounts: string[] = [];

        value?.forEach((account: string) => {
          const { network } = readAccountAddress(account);
          if (evmBasedChainNames.includes(network)) {
            evmAccounts.push(account);
          } else {
            nonEvmAccounts.push(account);
          }
        });

        const previousAccounts = connectedWallets
          .filter((wallet) => wallet.walletType === type)
          .map((wallet) =>
            formatAddressWithNetwork(wallet.address, wallet.chain)
          );

        if (previousAccounts.length > 0) {
          if (evmAccounts.length > 0) {
            // We use same logic for removing as we use for adding.
            const data = prepareAccountsForWalletStore(
              type,
              evmAccounts,
              evmBasedChainNames,
              supportedChainNames,
              info.isContractWallet
            );

            removeBalancesForWallet(type, {
              chains: data.map((account) => account.chain),
            });
          }

          if (nonEvmAccounts.length > 0) {
            removeBalancesForWallet(type, {
              chains: nonEvmAccounts.map((account) => {
                const { network } = readAccountAddress(account);
                return network;
              }),
            });
          }
        }
      }

      // After cleaning up balances, it's time to add new accounts.
      if (value) {
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          supportedChainNames,
          info.isContractWallet
        );
        if (data.length) {
          void newWalletConnected(data, info.namespace);
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

    /*
     * TODO: not sure why we used `Events.Acccounts` for detecting if a provider gets connected or not, if we can use `CONNCECTED` for the legacy
     * we can only rely Events.Connected and remove the legacy conidition
     */
    const isLegacyProviderConnected =
      event === Events.ACCOUNTS && state.connected;
    const isHubPorviderConnected = event === Events.CONNECTED && info.isHub;
    if (isLegacyProviderConnected || isHubPorviderConnected) {
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
      props.onUpdateState(type, event, value, state, info);
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
