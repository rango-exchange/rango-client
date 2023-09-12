import type { WidgetConfig } from '../types';

import React from 'react';
import { useRoutes } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { ConfirmSwapPage } from '../pages/ConfirmSwapPage';
import { HistoryPage } from '../pages/HistoryPage';
import { Home } from '../pages/Home';
import { LanguagePage } from '../pages/LanguagePage';
import { LiquiditySourcePage } from '../pages/LiquiditySourcePage';
import { SelectBlockchainPage } from '../pages/SelectBlockchainPage';
import { SelectSwapItemsPage } from '../pages/SelectSwapItemsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SwapDetailsPage } from '../pages/SwapDetailsPage';
import { ThemePage } from '../pages/ThemePage';
import { WalletsPage } from '../pages/WalletsPage';

const getAbsolutePath = (path: string) => path.replace('/', '');

interface PropTypes {
  config?: WidgetConfig;
}

export function AppRoutes(props: PropTypes) {
  const { config } = props;

  return useRoutes([
    {
      path: navigationRoutes.home,
      element: <Home />,
    },
    {
      path: navigationRoutes.fromSwap,
      element: (
        <SelectSwapItemsPage
          type="from"
          supportedChains={config?.from?.blockchains}
          supportedTokens={config?.from?.tokens}
        />
      ),
    },
    {
      path: navigationRoutes.toSwap,
      element: (
        <SelectSwapItemsPage
          type="to"
          supportedChains={config?.to?.blockchains}
          supportedTokens={config?.to?.tokens}
        />
      ),
    },
    {
      path: navigationRoutes.fromChain,
      element: (
        <SelectBlockchainPage
          type="from"
          supportedChains={config?.to?.blockchains}
        />
      ),
    },
    {
      path: navigationRoutes.toChain,
      element: (
        <SelectBlockchainPage
          type="to"
          supportedChains={config?.to?.blockchains}
        />
      ),
    },
    {
      path: navigationRoutes.settings,
      element: (
        <SettingsPage
          singleTheme={config?.theme?.singleTheme}
          supportedSwappers={config?.liquiditySources}
        />
      ),
    },
    {
      path: navigationRoutes.themes,
      element: <ThemePage />,
    },
    {
      path: navigationRoutes.languages,
      element: <LanguagePage />,
    },
    {
      path: navigationRoutes.exchanges,
      element: (
        <LiquiditySourcePage
          sourceType="Exchanges"
          supportedSwappers={config?.liquiditySources}
        />
      ),
    },
    {
      path: navigationRoutes.bridges,
      element: (
        <LiquiditySourcePage
          sourceType="Bridges"
          supportedSwappers={config?.liquiditySources}
        />
      ),
    },
    { path: navigationRoutes.swaps, element: <HistoryPage /> },
    {
      path: navigationRoutes.swapDetails,
      element: <SwapDetailsPage />,
    },
    {
      path: navigationRoutes.wallets,
      element: (
        <WalletsPage
          supportedWallets={config?.wallets}
          multiWallets={
            typeof config?.multiWallets === 'undefined'
              ? true
              : config.multiWallets
          }
          config={config}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.confirmSwap),
      element: <ConfirmSwapPage config={config} />,
    },
  ]);
}
