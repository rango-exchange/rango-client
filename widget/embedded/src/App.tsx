import { SwapContainer } from '@rangodev/ui';
import React from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import './app.css';
import { Events, Provider } from '@rangodev/wallets-core';
import { allProviders } from '@rangodev/provider-all';
import { EventHandler } from '@rangodev/wallets-core/dist/wallet';
import { isEvmBlockchain, Network } from '@rangodev/wallets-shared';
import { prepareAccountsForWalletStore, walletAndSupportedChainsNames } from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { Layout } from './components/Layout';
import { globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';

const providers = allProviders();
interface Token {
  name: string;
  contractAddress?: string;
}

//todo: update interface and update widget state based on WidgetProps change
export type WidgetProps = {
  fromChain?: string;
  fromToken?: string;
  toChain?: string;
  toToken?: string;
  fromAmount?: string;
  slippage?: number;
  chains?: string[];
  tokens?: Token[];
  liquiditySources?: string[];
  theme: 'dark' | 'light' | 'auto';
};

export function App() {
  globalStyles();
  const { activeTheme } = useTheme();
  const { blockchains, tokens } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const evmBasedChainNames = blockchains
    //@ts-ignore
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (type, event, value, state, supportedChains) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          //@ts-ignore
          walletAndSupportedChainsNames(supportedChains);
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          supportedChainNames,
        );
        connectWallet(data, tokens);
      } else {
        disconnectWallet(type);
      }
    }
  };

  return (
    //@ts-ignore
    <Provider allBlockChains={blockchains} providers={providers} onUpdateState={onUpdateState}>
      <div id="pageContainer" className={activeTheme}>
        <SwapContainer>
          <AppRouter>
            <Layout />
          </AppRouter>
        </SwapContainer>
      </div>
    </Provider>
  );
}
