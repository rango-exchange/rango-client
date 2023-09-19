import type { WidgetConfig } from './types';
import type { ProvidersOptions } from './utils/providers';
import type { EventHandler } from '@rango-dev/wallets-react';
import type { Network } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { Events, Provider } from '@rango-dev/wallets-react';
import { isEvmBlockchain } from 'rango-sdk';
import React, { createContext, useRef } from 'react';

import { useWalletProviders } from './hooks/useWalletProviders';
import { useMetaStore } from './store/meta';
import { useWalletsStore } from './store/wallets';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from './utils/wallets';

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
    providers: WidgetConfig['wallets'];
    options?: ProvidersOptions;
    onUpdateState?: EventHandler;
  }>
) {
  const { blockchains } = useMetaStore.use.meta();
  const { providers } = useWalletProviders(props.providers, props?.options);
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
    supportedBlockchains
  ) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          walletAndSupportedChainsNames(supportedBlockchains);
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
      props.onUpdateState(type, event, value, state, supportedBlockchains);
    }
  };
  return (
    <WidgetContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        onConnectWallet: (handler) => {
          onConnectWalletHandler.current = handler;
        },
      }}>
      <Provider
        allBlockChains={blockchains}
        providers={providers}
        onUpdateState={onUpdateState}
        autoConnect>
        {props.children}
      </Provider>
    </WidgetContext.Provider>
  );
}
