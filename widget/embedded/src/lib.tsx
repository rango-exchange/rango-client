import { SwapContainer } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
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
import { globalFont, globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import { isEvmBlockchain } from 'rango-sdk';
import { Configs } from './types';
import { useSettingsStore } from './store/settings';
import useSelectLanguage from './hooks/useSelectLanguage';
import './i18n';
import QueueManager from './QueueManager';

export type WidgetProps = {
  configs: Configs;
};

export const SwapBox: React.FC<WidgetProps> = ({ configs }) => {
  globalStyles();
  globalFont(configs?.fontFamily || 'Roboto');

  const { activeTheme } = useTheme({
    ...configs.colors,
    borderRadius: configs?.borderRadius,
    fontFamily: configs?.fontFamily,
  });
  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const setTheme = useSettingsStore.use.setTheme();
  const { changeLanguage } = useSelectLanguage();
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();

  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();

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
    if (configs.theme !== 'auto') setTheme(configs.theme);
  }, [configs.theme]);

  useEffect(() => {
    const wallets = configs.wallets;
    clearConnectedWallet();
    providers =
      wallets === 'all'
        ? allProviders()
        : allProviders().filter((provider) => {
            const type = provider.config.type;
            return wallets.find((w) => w === type);
          });
  }, [configs?.wallets]);

  useEffect(() => {
    changeLanguage(configs?.languege);
  }, [configs?.languege]);

  return (
    <Provider
      allBlockChains={blockchains}
      providers={providers}
      onUpdateState={onUpdateState}
    >
      <div id="pageContainer" className={activeTheme}>
        <QueueManager>
          <SwapContainer
            style={{
              width: configs?.width || 'auto',
              height: configs?.height || 'auto',
            }}
          >
            <AppRouter
              title={configs.title}
              titleSize={configs.titleSize}
              titleWeight={configs.titleWeight}
              lastConnectedWallet={lastConnectedWalletWithNetwork}
              disconnectedWallet={disconnectedWallet}
              clearDisconnectedWallet={() => {
                setDisconnectedWallet(undefined);
              }}
            >
              <Layout configs={configs} />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
};
