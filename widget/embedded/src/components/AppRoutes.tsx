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

export function AppRoutes() {
  return useRoutes([
    {
      path: navigationRoutes.home,
      element: <Home />,
    },
    {
      path: navigationRoutes.fromSwap,
      element: <SelectSwapItemsPage type="source" />,
    },
    {
      path: navigationRoutes.toSwap,
      element: <SelectSwapItemsPage type="destination" />,
    },
    {
      path: navigationRoutes.fromBlockchain,
      element: <SelectBlockchainPage type="source" />,
    },
    {
      path: navigationRoutes.toBlockchain,
      element: <SelectBlockchainPage type="destination" />,
    },
    {
      path: navigationRoutes.settings,
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
    { path: navigationRoutes.swaps, element: <HistoryPage /> },
    {
      path: navigationRoutes.swapDetails,
      element: <SwapDetailsPage />,
    },
    {
      path: navigationRoutes.wallets,
      element: <WalletsPage />,
    },
    {
      path: getAbsolutePath(navigationRoutes.confirmSwap),
      element: <ConfirmSwapPage />,
    },
  ]);
}
