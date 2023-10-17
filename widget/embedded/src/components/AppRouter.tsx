import type { WidgetConfig } from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { useQueueManager } from '@rango-dev/queue-manager-rango-preset';
import { useWallets } from '@rango-dev/wallets-react';
import { isEvmBlockchain } from 'rango-types';
import React, { useEffect, useRef } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { Home } from '../pages/Home';
import { useMetaStore } from '../store/meta';

import { UpdateUrl } from './UpdateUrl';

function Route(props: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const firstRender = useRef(true);
  const paths = location.pathname.split('/');
  const pathMatched = paths[paths.length - 1] === navigationRoutes.confirmSwap;
  const shouldRedirectToMainPage = pathMatched && firstRender.current;

  useEffect(() => {
    if (shouldRedirectToMainPage) {
      navigate('.');
    }
    firstRender.current = false;
  }, []);

  if (shouldRedirectToMainPage) {
    return <Home />;
  }

  return <> {props.children}</>;
}

export function AppRouter({
  children,
  ...props
}: PropsWithChildren & {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
  config: WidgetConfig | undefined;
}) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Route : MemoryRouter;
  const { blockchains } = useMetaStore.use.meta();
  const { canSwitchNetworkTo } = useWallets();

  const evmChains = blockchains.filter(isEvmBlockchain);

  useQueueManager({
    lastConnectedWallet: props.lastConnectedWallet,
    clearDisconnectedWallet: props.clearDisconnectedWallet,
    disconnectedWallet: props.disconnectedWallet,
    evmChains,
    canSwitchNetworkTo,
  });

  return (
    <>
      <Router>{children}</Router>
      {isRouterInContext && <UpdateUrl config={props.config} />}
    </>
  );
}
