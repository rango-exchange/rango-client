import React, { Fragment, PropsWithChildren } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';
import { UpdateUrl } from './UpdateUrl';

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Fragment : MemoryRouter;

  return (
    <>
      <Router>{children}</Router>
      {isRouterInContext && <UpdateUrl />}
    </>
  );
}
