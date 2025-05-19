import type { PropsWithChildren } from 'react';

import React, { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContext = useInRouterContext();

  const Router = isRouterInContext ? Fragment : MemoryRouter;

  return <Router>{children}</Router>;
}
