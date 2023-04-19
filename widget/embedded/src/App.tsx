import { SwapContainer, ToastProvider } from '@rango-dev/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import './app.css';
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
import { globalFont, globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import QueueManager from './QueueManager';
import { isEvmBlockchain } from 'rango-sdk';
import { WidgetConfig } from './types';
import './i18n';
import { useUiStore } from './store/ui';
import { navigationRoutes } from './constants/navigationRoutes';
import { initConfig } from './utils/configs';

const providers = allProviders();

export type WidgetProps = {
  config?: WidgetConfig;
};

export function App({ config }: WidgetProps) {
  globalStyles();
  globalFont(config?.theme?.fontFamily || 'Roboto');
  const { activeTheme } = useTheme({ ...config?.theme });
  useMemo(() => {
    if (config?.apiKey) {
      initConfig({
        API_KEY: config?.apiKey,
      });
    }
  }, [config]);

  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const currentPage = useUiStore.use.currentPage();

  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const themeBackground = activeTheme?.colors?.background?.value;

  useEffect(() => {
    document.body.style.background = themeBackground;
  }, [themeBackground]);

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
        setDisconnectedWallet(type);
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

  return (
    <Provider
      allBlockChains={blockchains}
      providers={providers}
      onUpdateState={onUpdateState}
    >
      <div id="pageContainer" className={activeTheme}>
        <ToastProvider
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          container={document.getElementById('swap-box')!}
        >
          <QueueManager>
            <SwapContainer
              fixedHeight={currentPage !== navigationRoutes.home}
            >
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
        </ToastProvider>
      </div>
    </Provider>
  );
}
