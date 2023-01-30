import React, { Fragment, PropsWithChildren } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContex = useInRouterContext();
  const Router = isRouterInContex ? Fragment : MemoryRouter;

  return <Router>{children}</Router>;
}
