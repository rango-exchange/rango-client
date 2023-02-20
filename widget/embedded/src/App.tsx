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
import { httpService } from './services/httpService';
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
  const { blockchains } = useMetaStore((state) => state.meta);
  const { insertAccount, disconnectWallet } = useWalletsStore();
  const { insertBalance } = useWalletsStore();
  //TDOD : remove any after resloving type conflicts
  const evmBasedChainNames = useMetaStore((state) => state.meta.blockchains as any)
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (type, event, value, state, supportedChains) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null = walletAndSupportedChainsNames(
          supportedChains as any,
        );
        const data = prepareAccountsForWalletStore(
          type,
          value,
          state.network,
          evmBasedChainNames,
          supportedChainNames,
        );
        insertAccount(data);
        httpService
          .getWalletsDetails(
            data.map((acc) => ({
              address: acc.accountsWithBalance[0].address,
              blockchain: acc.blockchain,
            })),
          )
          .then((res) => {
            insertBalance(res.wallets, data[0].accountsWithBalance[0].walletType);
          })
          .catch();
      } else {
        disconnectWallet(type);
      }
    }
  };

  return (
    <Provider
      //TDOD : remove any after resloving type conflicts
      allBlockChains={blockchains as any}
      providers={providers}
      onUpdateState={onUpdateState}>
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
