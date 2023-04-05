import { SwapContainer } from '@rango-dev/ui';
import React from 'react';
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
import { globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import QueueManager from './QueueManager';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import { BlockchainMeta, isEvmBlockchain } from 'rango-sdk';

const providers = allProviders();
interface Token {
  name: string;
  contractAddress?: string;
}

//todo: update interface and update widget state based on WidgetProps change
export type WidgetProps = {
  fromChain: BlockchainMeta | null;
  fromToken: Token | null;
  toChain: BlockchainMeta | null;
  toToken: Token | null;
  fromAmount: number;
  fromChains: 'all' | BlockchainMeta[];
  fromTokens: 'all' | Token[];
  toChains: 'all' | BlockchainMeta[];
  toTokens: 'all' | Token[];
  liquiditySources: 'all' | LiquiditySource[];
  wallets: 'all' | WalletType[];
  multiChain: boolean;
  customeAddress: boolean;
  theme: 'dark' | 'light' | 'auto';
  title: string;
  width: number;
  height: number;
  languege: string;
  borderRadius: number;
  fontFaminy: string;
  titleSize: number;
  titelsWeight: number;
  colors: {
    background: string;
    inputBackground: string;
    icons: string;
    primary: string;
    secondary: string;
    text: string;
    success: string;
    error: string;
    warning: string;
  };
};

export function App() {
  globalStyles();
  const { activeTheme } = useTheme();
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
              <Layout />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
}
