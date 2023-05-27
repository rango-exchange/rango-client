import { SwapContainer } from '@rango-dev/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import { Events, Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { EventHandler } from '@rango-dev/wallets-core/dist/wallet';
import { Network, WalletType } from '@rango-dev/wallets-shared';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { Layout } from './components/Layout';
import { globalFont } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import { isEvmBlockchain } from 'rango-sdk';
import { WidgetConfig } from './types';
import useSelectLanguage from './hooks/useSelectLanguage';
import './i18n';
import QueueManager from './QueueManager';
import { useUiStore } from './store/ui';
import { navigationRoutes } from './constants/navigationRoutes';
import { initConfig } from './utils/configs';

export type WidgetProps = {
  config?: WidgetConfig;
};

export const Widget: React.FC<WidgetProps> = ({ config }) => {
  globalFont(config?.theme?.fontFamily || 'Roboto');

  const { activeTheme } = useTheme({ ...config?.theme });
  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const { changeLanguage } = useSelectLanguage();
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const currentPage = useUiStore.use.currentPage();

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  useMemo(() => {
    if (config?.apiKey) {
      initConfig({
        API_KEY: config?.apiKey,
      });
    }
  }, [config]);

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
        setLastConnectedWalletWithNetwork(key);
      }
    }

    if (event === Events.NETWORK && state.network) {
      const key = `${type}-${state.network}`;
      setLastConnectedWalletWithNetwork(key);
    }
  };
  let providers = allProviders();

  useEffect(() => {
    const wallets = config?.wallets;
    clearConnectedWallet();
    providers = !wallets
      ? allProviders()
      : allProviders().filter((provider) => {
          const type = provider.config.type;
          return wallets.find((w) => w === type);
        });
  }, [config?.wallets]);

  useEffect(() => {
    changeLanguage(config?.language || 'en');
  }, [config?.language]);

  return (
    <Provider
      allBlockChains={blockchains}
      providers={providers}
      onUpdateState={onUpdateState}
    >
      <div id="swap-container" className={activeTheme}>
        <QueueManager>
          <SwapContainer fixedHeight={currentPage !== navigationRoutes.home}>
            <AppRouter
              lastConnectedWallet={lastConnectedWalletWithNetwork}
              disconnectedWallet={disconnectedWallet}
              clearDisconnectedWallet={() => {
                setDisconnectedWallet(undefined);
              }}
            >
              <Layout config={config} />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
};
