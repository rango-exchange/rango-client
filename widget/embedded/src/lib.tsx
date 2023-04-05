import { SwapContainer } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
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
import { globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import { isEvmBlockchain } from 'rango-sdk';
import { Configs } from './types';
import { useSettingsStore } from './store/settings';

export type WidgetProps = {
  configs: Configs;
};

export const SwapBox: React.FC<WidgetProps> = ({ configs }) => {
  globalStyles();
  const { activeTheme } = useTheme();
  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const setTheme = useSettingsStore.use.setTheme();

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (type, event, value, supportedChains) => {
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
  const wallets = configs.wallets;
  const providers =
    wallets === 'all'
      ? allProviders()
      : allProviders().filter((provider) => {
          const type = provider.config.type;
          return wallets.find((w) => w === type);
        });

  useEffect(() => {
    if (configs.theme !== 'auto') setTheme(configs.theme);
  }, [configs.theme]);
  return (
    <Provider
      allBlockChains={blockchains}
      providers={providers}
      onUpdateState={onUpdateState}
    >
      <div id="pageContainer" className={activeTheme}>
        <SwapContainer>
          <AppRouter>
            <Layout configs={configs} />
          </AppRouter>
        </SwapContainer>
      </div>
    </Provider>
  );
};
