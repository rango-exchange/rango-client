import React, { PropsWithChildren, useEffect, useRef } from 'react';
import {
  MemoryRouter,
  useInRouterContext,
  useLocation,
  useNavigate,
} from 'react-router';
import { useQueueManager } from '@rango-dev/queue-manager-rango-preset';
import { navigationRoutes } from '../constants/navigationRoutes';
import { WalletType } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-types';
import { UpdateUrl } from './UpdateUrl';
import { Home } from '../pages/Home';
import { useMetaStore } from '../store/meta';

const Route: React.FC = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(true);

  useEffect(() => {
    if (location.pathname === navigationRoutes.confirmSwap && ref.current)
      navigate(navigationRoutes.home + location.search, { state: 'redirect' });

    ref.current = false;
  }, []);

  if (location.pathname === navigationRoutes.confirmSwap && ref.current)
    return <Home />;

  return <> {children}</>;
};

export function AppRouter({
  children,
  ...props
}: PropsWithChildren & {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
}) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Route : MemoryRouter;
  const { blockchains } = useMetaStore.use.meta();

  const evmChains = blockchains.filter(isEvmBlockchain);

  useQueueManager({
    lastConnectedWallet: props.lastConnectedWallet,
    clearDisconnectedWallet: props.clearDisconnectedWallet,
    disconnectedWallet: props.disconnectedWallet,
    evmChains,
    notifier: () => {},
  });

  return (
    <>
      <Router {...props}>{children}</Router>
      {isRouterInContext && <UpdateUrl />}
    </>
  );
}
