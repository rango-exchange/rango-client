import type { AppMode } from './ModeTabs';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { Refuel, SwapModeContext, Widget } from '@rango-dev/widget-embedded';
import React, { useRef, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';

import {
  TON_CONNECT_MANIFEST_URL,
  TREZOR_MANIFEST,
  WC_PROJECT_ID,
} from './constants';
import { MOCK_STOCKS_META, STOCK_TICKERS, USDC_ARBITRUM } from './mocks/stocks';
import { ModeTabs } from './ModeTabs';

const MODE_STORAGE_KEY = 'widget-app-mode';
const REFUEL_MODE = { swapMode: 'refuel', isMultiMode: false } as const;
const DEFAULT_TICKER = 'TSLA';

function readStoredMode(): AppMode {
  try {
    const mode = localStorage.getItem(MODE_STORAGE_KEY);
    if (mode === 'swap' || mode === 'refuel' || mode === 'stocks') {
      return mode;
    }
  } catch {
    // Storage is not available, fall back to the default mode.
  }
  return 'swap';
}

function storeMode(mode: AppMode) {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Storage is not available, the mode just won't be remembered.
  }
}

// Stocks is not a separate widget: the normal widget switches to stocks mode with the experimental config.
function StocksWidget(props: { config: WidgetConfig }) {
  const [ticker, setTicker] = useState(DEFAULT_TICKER);

  return (
    <>
      <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        <label htmlFor="app-stocks-ticker">Ticker: </label>
        <select
          id="app-stocks-ticker"
          value={ticker}
          onChange={(event) => setTicker(event.target.value)}>
          {STOCK_TICKERS.map((item) => (
            <option key={item} id={`app-stocks-ticker-${item}`} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <Widget
        config={{
          ...props.config,
          from: { token: USDC_ARBITRUM },
          __UNSTABLE_OR_INTERNAL__: {
            ...props.config.__UNSTABLE_OR_INTERNAL__,
            stocks: { meta: MOCK_STOCKS_META, ticker },
          },
        }}
      />
    </>
  );
}

function ModeWidget(props: { mode: AppMode; config: WidgetConfig }) {
  const { mode, config } = props;

  if (mode === 'refuel') {
    return (
      <SwapModeContext.Provider value={REFUEL_MODE}>
        <Refuel config={config} />
      </SwapModeContext.Provider>
    );
  }

  if (mode === 'stocks') {
    return <StocksWidget config={config} />;
  }

  return <Widget config={config} />;
}

export function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const configRef = useRef<WidgetConfig>();
  const configParam = searchParams.get('config');
  const [mode, setMode] = useState<AppMode>(readStoredMode);

  let config: WidgetConfig | undefined = undefined;

  if (!configRef.current) {
    if (!!configParam) {
      try {
        config = JSON.parse(configParam, (_, value) => {
          if (typeof value === 'string' && value[0] === '$') {
            return value.replace('$', '#');
          }
          return value;
        });
      } catch (error) {
        console.error('Widget config param is invalid!', error);
      }
    } else {
      /*
       *TODO:
       *The assumption here is this object won't be created on iframe so we are on dev mode.
       *We should consider a more proper way.
       */

      config = {
        apiKey: '',
        walletConnectProjectId: WC_PROJECT_ID,
        trezorManifest: TREZOR_MANIFEST,
        tonConnect: { manifestUrl: TON_CONNECT_MANIFEST_URL },
      };
    }
    if (!!config) {
      configRef.current = config;
    }
  }

  // Config from the url param means we are inside an iframe, so only the default widget is rendered.
  if (configParam) {
    return (
      <Routes>
        <Route path="/*" element={<Widget config={configRef.current} />} />
      </Routes>
    );
  }

  const handleModeChange = (nextMode: AppMode) => {
    storeMode(nextMode);
    setMode(nextMode);
    // Each mode starts from its home page.
    navigate('/');
  };

  return (
    <>
      <ModeTabs value={mode} onChange={handleModeChange} />
      <Routes>
        <Route
          path="/*"
          element={
            configRef.current ? (
              <ModeWidget key={mode} mode={mode} config={configRef.current} />
            ) : null
          }
        />
      </Routes>
    </>
  );
}
