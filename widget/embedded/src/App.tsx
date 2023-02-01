import { SwapContainer, darkTheme, lightTheme } from '@rangodev/ui';
import React, { useEffect, useState } from 'react';
import { AppRouter } from './router/AppRouter';
import { AppRoutes } from './router/AppRoutes';
import { useMetaStore } from './store/meta';
import './app.css';
import { BrowserRouter } from 'react-router-dom';
import { useSettingsStore } from './store/settings';

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
  const fetchMeta = useMetaStore((state) => state.fetchMeta);
  const { theme } = useSettingsStore();
  const [OSTheme, setOSTheme] = useState(lightTheme);

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
      <SwapContainer onConnectWallet={() => alert('connect your wallet:')} fixedHeight={true}>
        <AppRouter>
          <AppRoutes />
        </AppRouter>
      </SwapContainer>
    </div>
  );
}
