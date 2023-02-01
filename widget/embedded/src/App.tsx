import { SwapContainer, darkTheme } from '@rangodev/ui';
import React, { useEffect } from 'react';
import { AppRouter } from './AppRouter';
import { AppRoutes } from './AppRoutes';
import { useMetaStore } from './store/meta';
import './app.css';
import { BrowserRouter } from 'react-router-dom';

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
  const fetchMeta = useMetaStore(state => state.fetchMeta);

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();
  }, []);

  return (
    <div className={darkTheme}>
      <SwapContainer onConnectWallet={() => alert('connect your wallet:')} fixedHeight={true}>
        <AppRouter>
          <AppRoutes />
        </AppRouter>
      </SwapContainer>
    </div>
  );
}
