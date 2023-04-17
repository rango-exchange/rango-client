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
import { Configs } from '../types';

const getAbsolutePath = (path: string) => path.replace('/', '');

interface PropTypes {
  configs?: Configs;
}

export function AppRoutes(props: PropTypes) {
  const { configs } = props;

  return useRoutes([
    {
      path: getAbsolutePath(navigationRoutes.home),
      element: (
        <Home
          title={configs?.title}
          titleSize={configs?.titleSize}
          titleWeight={configs?.titleWeight}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.fromChain),
      element: (
        <SelectChainPage
          type="from"
          supportedChains={configs?.fromChains || 'all'}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.toChain),
      element: (
        <SelectChainPage
          type="to"
          supportedChains={configs?.toChains || 'all'}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.fromToken),
      element: (
        <SelectTokenPage
          type="from"
          supportedTokens={configs?.fromTokens || 'all'}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.toToken),
      element: (
        <SelectTokenPage
          type="to"
          supportedTokens={configs?.toTokens || 'all'}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.settings),
      element: (
        <SettingsPage supportedSwappers={configs?.liquiditySources || 'all'} />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.liquiditySources),
      element: (
        <LiquiditySourcePage
          supportedSwappers={configs?.liquiditySources || 'all'}
        />
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
          supportedWallets={configs?.wallets || 'all'}
          multiWallets={
            typeof configs?.multiWallets === 'undefined'
              ? true
              : configs.multiWallets
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
