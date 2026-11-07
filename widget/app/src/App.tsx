import type { AppWidgetConfig } from './walletsSetup';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { Widget, WidgetProvider } from '@rango-dev/widget-embedded';
import React, { useMemo } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import {
  TON_CONNECT_MANIFEST_URL,
  TREZOR_MANIFEST,
  WC_PROJECT_ID,
} from './constants';
import { WalletsHost } from './wallets';
import { createProviders, splitConfig } from './walletsSetup';

function readConfig(configParam: string | null): AppWidgetConfig | undefined {
  if (!configParam) {
    /*
     *TODO:
     *The assumption here is this object won't be created on iframe so we are on dev mode.
     *We should consider a more proper way.
     */
    return {
      apiKey: '',
      walletConnectProjectId: WC_PROJECT_ID,
      trezorManifest: TREZOR_MANIFEST,
      tonConnect: { manifestUrl: TON_CONNECT_MANIFEST_URL },
    };
  }

  try {
    return JSON.parse(configParam, (_, value) => {
      if (typeof value === 'string' && value[0] === '$') {
        return value.replace('$', '#');
      }
      return value;
    });
  } catch (error) {
    console.error('Widget config param is invalid!', error);
    return undefined;
  }
}

export function App() {
  const [searchParams] = useSearchParams();
  const configParam = searchParams.get('config');

  // The config is read once; providers are stateful and must not be recreated.
  const { widgetConfig, setup, providers } = useMemo(() => {
    const { widgetConfig, setup, walletIds } = splitConfig(
      readConfig(configParam) ?? { apiKey: '' }
    );
    return {
      widgetConfig,
      setup,
      providers: createProviders(setup, walletIds),
    };
  }, []);

  return (
    <WalletsHost providers={providers} setup={setup}>
      {(walletController, statusReporter) => {
        const config: WidgetConfig = {
          ...widgetConfig,
          wallets: providers,
          walletController,
        };
        return (
          <WidgetProvider config={config}>
            {statusReporter}
            <Routes>
              <Route
                path="/*"
                element={
                  <Widget config={{ ...config, externalWallets: true }} />
                }
              />
            </Routes>
          </WidgetProvider>
        );
      }}
    </WalletsHost>
  );
}
