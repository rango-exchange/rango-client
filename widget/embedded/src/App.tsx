import { SwapContainer, darkTheme, lightTheme } from '@rangodev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { AppRouter } from './router/AppRouter';
import { AppRoutes } from './router/AppRoutes';
import { useMetaStore } from './store/meta';
import './app.css';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSettingsStore } from './store/settings';
import { useBestRouteStore } from './store/bestRoute';

interface Token {
  name: string;
  contractAddress?: string;
}

export type WidgetProps = {
  fromChain?: string;
  fromToken?: string;
  toChain?: string;
  toToken?: string;
  fromAmount?: string;
  slippage?: number;
  chains?: string[];
  tokens?: Token[];
  liquiditySources?: string[];
  theme: 'dark' | 'light' | 'auto';
};

export function App() {
  const firstRender = useRef(true);
  const fetchMeta = useMetaStore((state) => state.fetchMeta);
  const { theme } = useSettingsStore();
  const [OSTheme, setOSTheme] = useState(lightTheme);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    loadingStatus,
    meta: { blockchains, tokens },
  } = useMetaStore();
  const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    setFromChain,
    setFromToken,
    setToChain,
    setToToken,
  } = useBestRouteStore();
  useEffect(() => {
    //todo: refactor and replace strings with constants
    if (!firstRender.current) {
      const fChain = fromChain?.name || '';
      const fToken =
        (fromToken?.symbol || '') + (fromToken?.address ? '--' + fromToken?.address : '');
      const tChain = toChain?.name || '';
      const tToken = (toToken?.symbol || '') + (toToken?.address ? '--' + toToken?.address : '');
      setSearchParams({
        ...(fChain && { fromChain: fChain }),
        ...(fToken && { fromToken: fToken }),
        ...(tChain && { toChain: tChain }),
        ...(tToken && { toToken: tToken }),
      });
    }
    firstRender.current = false;
  }, [location.pathname]);

  useEffect(() => {
    //todo: refactor and replace strings with constants
    if (loadingStatus === 'success') {
      const fChain = searchParams.get('fromChain');
      const fToken = searchParams.get('fromToken');
      const tChain = searchParams.get('toChain');
      const tToken = searchParams.get('toToken');
      const fromChain = blockchains.find((blockchain) => blockchain.name === fChain);
      const fromToken = tokens.find((token) => {
        const t = fToken?.split('--');
        return token.symbol === t?.[0] && token.address === t?.[1];
      });
      const toChain = blockchains.find((blockchain) => blockchain.name === tChain);
      const toToken = tokens.find((token) => {
        const t = tToken?.split('--');
        return token.symbol === t?.[0] && token.address === t?.[1];
      });
      if (!!fromChain) {
        setFromChain(fromChain);
        if (!!fromToken) setFromToken(fromToken);
      }
      if (!!toChain) {
        setToChain(toChain);
        if (!!toToken) setToToken(toToken);
      }
    }
  }, [loadingStatus]);

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) setOSTheme(darkTheme);
      else setOSTheme(lightTheme);
    };

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setOSTheme(darkTheme);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', switchTheme);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchTheme);
    };
  }, []);

  const getTheme = () => {
    if (theme === 'auto') return OSTheme;
    else return theme === 'dark' ? darkTheme : lightTheme;
  };

  return (
    <div className={getTheme()}>
      <SwapContainer onConnectWallet={() => alert('connect your wallet:')}>
        <AppRouter>
          <AppRoutes />
        </AppRouter>
      </SwapContainer>
    </div>
  );
}
