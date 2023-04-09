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
import { ConfirmWalletsPage } from '../pages/ConfirmWalletsPage';
import { SwapDetailsPage } from '../pages/SwapDetailsPage';
import { Configs } from '../types';

interface PropTypes {
  configs?: Configs;
}

export function AppRoutes(props: PropTypes) {
  const { configs } = props;

  return useRoutes([
    {
      path: navigationRoutes.home,
      element: (
        <Home
          title={configs?.title}
          titleSize={configs?.titleSize}
          titleWeight={configs?.titleWeight}
        />
      ),
    },
    {
      path: navigationRoutes.fromChain,
      element: (
        <SelectChainPage
          type="from"
          supportedChains={configs?.fromChains || 'all'}
        />
      ),
    },
    {
      path: navigationRoutes.toChain,
      element: (
        <SelectChainPage
          type="to"
          supportedChains={configs?.toChains || 'all'}
        />
      ),
    },
    {
      path: navigationRoutes.fromToken + '/*',
      element: (
        <SelectTokenPage
          type="from"
          supportedTokens={configs?.fromTokens || 'all'}
        />
      ),
    },
    {
      path: navigationRoutes.toToken,
      element: (
        <SelectTokenPage
          type="to"
          supportedTokens={configs?.toTokens || 'all'}
        />
      ),
    },
    {
      path: navigationRoutes.settings,
      element: (
        <SettingsPage supportedSwappers={configs?.liquiditySources || 'all'} />
      ),
    },
    {
      path: navigationRoutes.liquiditySources,
      element: (
        <LiquiditySourcePage
          supportedSwappers={configs?.liquiditySources || 'all'}
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
          supportedWallets={configs?.wallets || 'all'}
          multiWallets={
            typeof configs?.multiWallets === 'undefined'
              ? true
              : configs.multiWallets
          }
        />
      ),
    },
    { path: navigationRoutes.confirmSwap, element: <ConfirmSwapPage /> },
    { path: navigationRoutes.confirmWallets, element: <ConfirmWalletsPage /> },
  ]);
}
