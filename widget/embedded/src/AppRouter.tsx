import React, { Fragment, PropsWithChildren, useEffect } from 'react';
import { MemoryRouter, useInRouterContext, useLocation, useMatch } from 'react-router';
import { urlToToken } from './helpers/url';
import { useMetaStore } from './store/meta';

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContex = useInRouterContext();
  const Router = isRouterInContex ? Fragment : MemoryRouter;

  const { loadingStatus, meta } = useMetaStore();

  useEffect(() => {
    if (loadingStatus === 'success') {
      const chainAndToken = urlToToken(meta.blockchains, meta.tokens, location.pathname);
    }
  }, [loadingStatus]);

  return <Router>{children}</Router>;
}
