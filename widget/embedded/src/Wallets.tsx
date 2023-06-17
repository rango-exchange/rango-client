import React, { PropsWithChildren } from 'react';
import { useMetaStore } from './store/meta';
import { Events, Provider } from '@rango-dev/wallets-core';
import { EventHandler } from '@rango-dev/wallets-core';
import { Network } from '@rango-dev/wallets-shared';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { isEvmBlockchain } from 'rango-sdk';
import './i18n';
import { useWalletProviders } from './hooks/useWalletProviders';
import { WidgetConfig } from './types';
import { createContext, useRef } from 'react';

type OnConnectHandler = (key: string) => void;
interface WidgetContextInterface {
  onConnectWallet(handler: OnConnectHandler): void;
}

export const WidgetContext = createContext<WidgetContextInterface>({
  onConnectWallet: () => {
    return;
  },
});

export function WidgetWallets(
  props: PropsWithChildren<{
    config: WidgetConfig['wallets'];
  }>
) {
  const { blockchains } = useMetaStore.use.meta();
  const { providers } = useWalletProviders(props.config);
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const onConnectWalletHandler = useRef<OnConnectHandler>();

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (
    type,
    event,
    value,
    state,
    supportedChains
  ) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          walletAndSupportedChainsNames(supportedChains);
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          supportedChainNames
        );
        connectWallet(data);
      } else {
        disconnectWallet(type);
      }
    }
    if (event === Events.ACCOUNTS && state.connected) {
      const key = `${type}-${state.network}-${value}`;

      if (state.connected) {
        if (!!onConnectWalletHandler.current)
          onConnectWalletHandler.current(key);
        else
          console.warn(
            `onConnectWallet handler hasn't been set. Are you sure?`
          );
      }
    }

    if (event === Events.NETWORK && state.network) {
      const key = `${type}-${state.network}`;
      if (!!onConnectWalletHandler.current) onConnectWalletHandler.current(key);
      else
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
    }
  };

  return (
    <WidgetContext.Provider
      value={{
        onConnectWallet: (handler) => {
          onConnectWalletHandler.current = handler;
        },
      }}>
      <Provider
        allBlockChains={blockchains}
        providers={providers}
        onUpdateState={onUpdateState}>
        {props.children}
      </Provider>
    </WidgetContext.Provider>
  );
}
