import { LiquiditySourcesSelector, Setting, Settings } from '@rangodev/ui';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Swap } from './pages/swap';

export const AppRoutes = () =>
  useRoutes([
    { path: '/', element: <Swap /> },
    { path: '/settings', element: <Settings /> },
    {
      path: '/settings/liquidity-sources',
      element: <LiquiditySourcesSelector />,
    },
  ]);
