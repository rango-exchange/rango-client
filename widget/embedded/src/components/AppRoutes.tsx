import React from 'react';
import { useRoutes } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { ConfirmSwapPage } from '../pages/ConfirmSwapPage';
import { HistoryPage } from '../pages/HistoryPage';
import { Home } from '../pages/Home';
import { LiquiditySourcePage } from '../pages/LiquiditySourcesPage';
import { SelectChainPage } from '../pages/SelectChainPage';
import { SelectTokenPage } from '../pages/SelectTokenPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WalletsPage } from '../pages/WalletsPage';
import { SwapDetailsPage } from '../pages/SwapDetailsPage';
import { WidgetConfig } from '../types';

const getAbsolutePath = (path: string) => path.replace('/', '');

interface PropTypes {
  config?: WidgetConfig;
}

export function AppRoutes(props: PropTypes) {
  const { config } = props;

  return useRoutes([
    {
      path: getAbsolutePath(navigationRoutes.home),
      element: <Home />,
    },
    {
      path: getAbsolutePath(navigationRoutes.fromChain),
      element: (
        <SelectChainPage
          type="from"
          supportedChains={config?.from?.blockchains}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.toChain),
      element: (
        <SelectChainPage type="to" supportedChains={config?.to?.blockchains} />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.fromToken),
      element: (
        <SelectTokenPage type="from" supportedTokens={config?.from?.tokens} />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.toToken),
      element: (
        <SelectTokenPage type="to" supportedTokens={config?.to?.tokens} />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.settings),
      element: <SettingsPage supportedSwappers={config?.liquiditySources} />,
    },
    {
      path: getAbsolutePath(navigationRoutes.liquiditySources),
      element: (
        <LiquiditySourcePage supportedSwappers={config?.liquiditySources} />
      ),
    },
    { path: getAbsolutePath(navigationRoutes.swaps), element: <HistoryPage /> },
    {
      path: navigationRoutes.swapDetails,
      element: <SwapDetailsPage />,
    },
    {
      path: getAbsolutePath(navigationRoutes.wallets),
      element: (
        <WalletsPage
          supportedWallets={config?.wallets}
          multiWallets={
            typeof config?.multiWallets === 'undefined'
              ? true
              : config.multiWallets
          }
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.confirmSwap),
      element: <ConfirmSwapPage />,
    },
  ]);
}
