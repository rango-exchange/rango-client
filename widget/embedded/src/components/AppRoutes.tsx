import React from 'react';
import { useRoutes } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { HistoryPage } from '../pages/HistoryPage';
import { Home } from '../pages/Home';
import { LiquiditySourcePage } from '../pages/LiquiditySourcesPage';
import { SelectChainPage } from '../pages/SelectChainPage';
import { SelectTokenPage } from '../pages/SelectTokenPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WalletsPage } from '../pages/WalletsPage';

export const AppRoutes = () =>
  useRoutes([
    { path: navigationRoutes.home, element: <Home /> },
    { path: navigationRoutes.fromChain, element: <SelectChainPage type="from" /> },
    { path: navigationRoutes.toChain, element: <SelectChainPage type="to" /> },
    { path: navigationRoutes.fromToken + '/*', element: <SelectTokenPage type="from" /> },
    { path: navigationRoutes.toToken, element: <SelectTokenPage type="to" /> },
    { path: navigationRoutes.settings, element: <SettingsPage /> },
    {
      path: navigationRoutes.liquiditySources,
      element: <LiquiditySourcePage />,
    },
    { path: navigationRoutes.history, element: <HistoryPage /> },
    { path: navigationRoutes.wallets, element: <WalletsPage /> },
  ]);
