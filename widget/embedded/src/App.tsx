import { SwapContainer, darkTheme, lightTheme } from '@rangodev/ui';
import React, { useEffect, useState } from 'react';
import { AppRouter } from './components/AppRouter';
import { AppRoutes } from './components/AppRoutes';
import { useMetaStore } from './store/meta';
import './app.css';
import { useSettingsStore } from './store/settings';
import { Events, Provider, WalletProvider } from '@rangodev/wallets-core';
import { allProviders } from '@rangodev/provider-all';
import { EventHandler } from '@rangodev/wallets-core/dist/wallet';
import { isEvmBlockchain, Network } from '@rangodev/wallets-shared';
import { prepareAccountsForWalletStore, walletAndSupportedChainsNames } from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { httpService } from './services/httpService';
import QueueManager from './QueueManager';

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
  const fetchMeta = useMetaStore((state) => state.fetchMeta);
  const { blockchains } = useMetaStore((state) => state.meta);
  const { insertAccount, disconnectWallet } = useWalletsStore();
  const { accounts, balance, insertBalance } = useWalletsStore();
  console.log(accounts, balance);
  const evmBasedChainNames = useMetaStore((state) => state.meta.blockchains as any)
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);
  const { theme } = useSettingsStore();
  const [OSTheme, setOSTheme] = useState(lightTheme);
  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) setOSTheme(darkTheme);
      else setOSTheme(lightTheme);
    };

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setOSTheme(darkTheme);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', switchTheme);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchTheme);
    };
  }, []);

  const getTheme = () => {
    if (theme === 'auto') return OSTheme;
    else return theme === 'dark' ? darkTheme : lightTheme;
  };

  const onUpdateState: EventHandler = (type, event, value, state, supportedChains) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          walletAndSupportedChainsNames(supportedChains);
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
      allBlockChains={blockchains as any}
      providers={providers}
      onUpdateState={onUpdateState}>
      <div id="pageContainer" className={getTheme()}>
        <QueueManager>
          <SwapContainer onConnectWallet={() => alert('connect your wallet:')}>
            <AppRouter>
              <AppRoutes />
            </AppRouter>
          </SwapContainer>
        </QueueManager>
      </div>
    </Provider>
  );
}
