import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { ToastProvider } from '@rango-dev/ui';
import { Widget, WidgetProvider } from '@rango-dev/widget-embedded';
import React, { useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PLAYGROUND_CONTAINER_ID } from './constants';
import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hooks/useTheme';
import { initialConfig, useConfigStore } from './store/config';
import { useMetaStore } from './store/meta';
import { getApiKeyFromEnvOrThrow } from './utils/env';
import { filterConfig } from './utils/export';
import {
  getProviders,
  getWalletsSetup,
  selectProviders,
  toWidgetConfig,
} from './utils/providers';
import { WalletsHost } from './utils/wallets';

export function App() {
  const { activeStyle } = useTheme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const config = useConfigStore.use.config();
  const { filteredConfigForExport } = filterConfig(config, initialConfig);
  const providers = getProviders();
  const wallets = useMemo(
    () => selectProviders(providers, config),
    [providers, config.wallets?.join('-')]
  );

  const setup = useMemo(
    () => getWalletsSetup(config),
    [
      config.walletConnectProjectId,
      config.trezorManifest,
      config.tonConnect,
      config.ledgerWallet,
    ]
  );

  const overridedConfig: Omit<WidgetConfig, 'walletController'> = {
    theme: {},
    ...toWidgetConfig({ ...config, ...filteredConfigForExport }),
    wallets,
    /*
     * externalWallets should be always true to avoid mounting WidgetProvider twice.
     * mounting multiple WidgetProviders may result in conflicts and unexpected behaviour.
     */
    externalWallets: true,
    apiKey: getApiKeyFromEnvOrThrow(),
    features: {
      theme: 'hidden',
    },
    __UNSTABLE_OR_INTERNAL__: {
      autoUpdateSettings: true,
    },
  };

  useEffect(() => {
    void fetchMeta();
  }, []);

  return (
    <ToastProvider container={document.body}>
      <div id={PLAYGROUND_CONTAINER_ID} className={activeStyle}>
        <WalletsHost providers={wallets} setup={setup}>
          {(walletController, statusReporter) => {
            const widgetConfig: WidgetConfig = {
              ...overridedConfig,
              walletController,
            };
            return (
              <WidgetProvider config={widgetConfig}>
                {statusReporter}
                <ConfigContainer>
                  <Routes>
                    <Route
                      path="/*"
                      element={<Widget config={widgetConfig} />}
                    />
                  </Routes>
                </ConfigContainer>
              </WidgetProvider>
            );
          }}
        </WalletsHost>
      </div>
    </ToastProvider>
  );
}
