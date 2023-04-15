import { SwapContainer } from '@rango-dev/ui';
import React, { useState } from 'react';
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
import { Configs } from './types';
import './i18n';

const providers = allProviders();

export type WidgetProps = {
  configs?: Configs;
};

export function App({ configs }: WidgetProps) {
  globalStyles();
  globalFont(configs?.fontFamily || 'Roboto');
  const { activeTheme } = useTheme({
    ...configs?.colors,
    borderRadius: configs?.borderRadius,
  });

  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();

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
        <QueueManager>
          <SwapContainer>
            <AppRouter
              title={configs?.title}
              titleSize={configs?.titleSize}
              titleWeight={configs?.titleWeight}
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
}
