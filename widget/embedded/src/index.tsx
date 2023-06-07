import { SwapContainer } from '@rango-dev/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import { Events, Provider } from '@rango-dev/wallets-core';
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
import {
  WidgetTheme,
  WidgetConfig,
  WidgetColors,
  BlockchainAndTokenConfig,
} from './types';
import useSelectLanguage from './hooks/useSelectLanguage';
import './i18n';
import QueueManager from './QueueManager';
import { useUiStore } from './store/ui';
import { navigationRoutes } from './constants/navigationRoutes';
import { initConfig } from './utils/configs';
import { getProviders } from './utils/common';

export { WidgetConfig, WidgetTheme, WidgetColors, BlockchainAndTokenConfig };

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

  useEffect(() => {
    changeLanguage(config?.language || 'en');
  }, [config?.language]);

  useEffect(() => {
    clearConnectedWallet();
  }, [config?.wallets, config?.externalProviders]);

  return (
    <Provider
      allBlockChains={blockchains}
      providers={getProviders(config?.wallets, config?.externalProviders)}
      onUpdateState={onUpdateState}
    >
      <div id="swap-container" className={activeTheme}>
        <QueueManager manageExternalProviders={config?.manageExternalProviders}>
          <SwapContainer fixedHeight={currentPage !== navigationRoutes.home}>
            <AppRouter
              lastConnectedWallet={lastConnectedWalletWithNetwork}
              disconnectedWallet={disconnectedWallet}
              clearDisconnectedWallet={() => {
                setDisconnectedWallet(undefined);
              }}
            >
              <Layout
                config={config}
                providers={getProviders(
                  config?.wallets,
                  config?.externalProviders
                )}
              />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
};
