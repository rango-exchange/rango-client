import {
  History,
  LiquiditySourcesSelector,
  SettingsIcon,
  Settings,
  Typography,
} from '@rangodev/ui';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Home } from './pages/Home';
import { SettingsPage } from './pages/SettingsPage';

export const AppRoutes = () =>
  useRoutes([
    { path: '/', element: <Home /> },
    { path: '/settings', element: <SettingsPage /> },
    // {
    //   path: '/settings/liquidity-sources',
    //   element: <LiquiditySourcesSelector />,
    //   },
  ]);
