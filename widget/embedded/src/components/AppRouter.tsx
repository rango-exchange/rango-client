import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { MemoryRouter, useInRouterContext, useLocation, useNavigate } from 'react-router';
import { navigationRoutes } from '../constants/navigationRoutes';
import { UpdateUrl } from './UpdateUrl';
import { Home } from '../pages/Home';

const Route: React.FC = (props: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(true);

  useEffect(() => {
    if (
      [navigationRoutes.confirmWallets, navigationRoutes.confirmSwap].includes(location.pathname) &&
      ref.current
    )
      navigate(navigationRoutes.home + location.search, { state: 'redirect' });

    ref.current = false;
  }, []);

  if (
    [navigationRoutes.confirmWallets, navigationRoutes.confirmSwap].includes(location.pathname) &&
    ref.current
  )
    return <Home />;

  return <> {props.children}</>;
};

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Route : MemoryRouter;

  return (
    <>
      <Router>{children}</Router>
      {isRouterInContext && <UpdateUrl />}
    </>
  );
}
