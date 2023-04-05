import { SwapContainer } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import './app.css';
import { Events, Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { EventHandler } from '@rango-dev/wallets-core/dist/wallet';
import { Network } from '@rango-dev/wallets-shared';
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
import "./i18n"

const providers = allProviders();

//todo: update interface and update widget state based on WidgetProps change
export type WidgetProps = {
  configs?: Configs;
};

export function App({ configs }: WidgetProps) {
  globalStyles();
  const { activeTheme } = useTheme({
    ...configs?.colors,
    borderRadius: configs?.borderRadius,
  });
  globalFont(configs?.fontFamily || 'Roboto');

  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();

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
          //@ts-ignore
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
  };


  return (
    //@ts-ignore
    <Provider
      allBlockChains={blockchains}
      providers={providers}
      onUpdateState={onUpdateState}
    >
      <div id="pageContainer" className={activeTheme}>
        <QueueManager>
          <SwapContainer>
            <AppRouter>
              <Layout configs={configs} />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
}
