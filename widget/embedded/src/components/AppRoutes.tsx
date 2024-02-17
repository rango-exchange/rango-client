import React from 'react';
import { useRoutes } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { useSyncStoresWithConfig } from '../hooks/useSyncStoresWithConfig';
import { useSyncUrlAndStore } from '../hooks/useSyncUrlAndStore';
import { ConfirmSwapPage } from '../pages/ConfirmSwapPage';
import { HistoryPage } from '../pages/HistoryPage';
import { Home } from '../pages/Home';
import { LanguagePage } from '../pages/LanguagePage';
import { LiquiditySourcePage } from '../pages/LiquiditySourcePage';
import { RoutesPage } from '../pages/Routes';
import { SelectBlockchainPage } from '../pages/SelectBlockchainPage';
import { SelectSwapItemsPage } from '../pages/SelectSwapItemsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SwapDetailsPage } from '../pages/SwapDetailsPage';
import { ThemePage } from '../pages/ThemePage';
import { WalletsPage } from '../pages/WalletsPage';

export function AppRoutes() {
  /**
   * The configuration of the widget should initially be applied to the widget state.
   * If search parameters exist in the URL,
   * they should be applied later and take precedence over the widget configuration.
   * To achieve this, it is crucial to execute these hooks in the correct sequence.
   */
  useSyncStoresWithConfig();
  useSyncUrlAndStore();

  return useRoutes([
    {
      path: navigationRoutes.home,
      element: <Home />,
    },
    {
      path: navigationRoutes.routes,
      element: <RoutesPage />,
    },
    {
      path: navigationRoutes.fromSwap,
      children: [
        {
          index: true,
          element: <SelectSwapItemsPage type="source" />,
        },
        {
          path: navigationRoutes.blockchains,
          element: <SelectBlockchainPage type="source" />,
        },
      ],
    },
    {
      path: navigationRoutes.toSwap,
      children: [
        {
          index: true,
          element: <SelectSwapItemsPage type="destination" />,
        },
        {
          path: navigationRoutes.blockchains,
          element: <SelectBlockchainPage type="destination" />,
        },
      ],
    },
    {
      path: navigationRoutes.settings,
      children: [
        {
          index: true,
          element: <SettingsPage />,
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
          element: <LiquiditySourcePage sourceType="Exchanges" />,
        },
        {
          path: navigationRoutes.bridges,
          element: <LiquiditySourcePage sourceType="Bridges" />,
        },
      ],
    },
    {
      path: navigationRoutes.swaps,
      children: [
        {
          index: true,
          element: <HistoryPage />,
        },
        {
          path: navigationRoutes.swapDetails,
          element: <SwapDetailsPage />,
        },
      ],
    },
    {
      path: navigationRoutes.wallets,
      element: <WalletsPage />,
    },
    {
      path: navigationRoutes.confirmSwap,
      element: <ConfirmSwapPage />,
    },
  ]);
}
