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

export const AppRoutes = ({
  fromChains = 'all',
  toChains = 'all',
  fromTokens = 'all',
  toTokens = 'all',
  liquiditySources = 'all',
  wallets = 'all',
  title,
  multiWallets = true,
  titleSize,
  titleWeight,
}: Configs) =>
  useRoutes([
    {
      path: navigationRoutes.home,
      element: (
        <Home title={title} titleSize={titleSize} titleWeight={titleWeight} />
      ),
    },
    {
      path: navigationRoutes.fromChain,
      element: <SelectChainPage type="from" supportedChains={fromChains} />,
    },
    {
      path: navigationRoutes.toChain,
      element: <SelectChainPage type="to" supportedChains={toChains} />,
    },
    {
      path: navigationRoutes.fromToken + '/*',
      element: <SelectTokenPage type="from" supportedTokens={fromTokens} />,
    },
    {
      path: navigationRoutes.toToken,
      element: <SelectTokenPage type="to" supportedTokens={toTokens} />,
    },
    {
      path: navigationRoutes.settings,
      element: <SettingsPage supportedSwappers={liquiditySources} />,
    },
    {
      path: navigationRoutes.liquiditySources,
      element: <LiquiditySourcePage supportedSwappers={liquiditySources} />,
    },
    { path: navigationRoutes.swaps, element: <HistoryPage /> },
    {
      path: navigationRoutes.swapDetails,
      element: <SwapDetailsPage />,
    },
    {
      path: navigationRoutes.wallets,
      element: (
        <WalletsPage supportedWallets={wallets} multiWallets={multiWallets} />
      ),
    },
    { path: navigationRoutes.confirmSwap, element: <ConfirmSwapPage /> },
    { path: navigationRoutes.confirmWallets, element: <ConfirmWalletsPage /> },
  ]);
