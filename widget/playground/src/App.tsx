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
import { selectProviders } from './utils/providers';

export function App() {
  const { activeStyle } = useTheme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const config = useConfigStore.use.config();
  const { filteredConfigForExport } = filterConfig(config, initialConfig);
  const wallets = useMemo(
    () => selectProviders(config),
    [config.wallets?.join('-')]
  );

  const overridedConfig: WidgetConfig = {
    theme: {},
    ...config,
    ...filteredConfigForExport,
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
        <WidgetProvider config={overridedConfig}>
          <ConfigContainer>
            <Routes>
              <Route path="/*" element={<Widget config={overridedConfig} />} />
            </Routes>
          </ConfigContainer>
        </WidgetProvider>
      </div>
    </ToastProvider>
  );
}
