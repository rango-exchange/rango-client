import React, { Fragment, PropsWithChildren, useEffect } from 'react';
import { MemoryRouter, useInRouterContext, useLocation } from 'react-router';
import { urlToToken } from './helpers/url';
import { useMetaStore } from './store/meta';

export function AppRouter({ children }: PropsWithChildren) {
  const isRouterInContex = useInRouterContext();
  const Router = isRouterInContex ? Fragment : MemoryRouter;

  const { loadingStatus, meta } = useMetaStore();
  const location = useLocation();

  useEffect(() => {
    if (loadingStatus === 'success') {
      const chainAndToken = urlToToken(meta.blockchains, meta.tokens, location.pathname);
    }
  }, [loadingStatus]);

  return <Router>{children}</Router>;
}
