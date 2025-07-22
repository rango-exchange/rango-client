import type { WidgetConfig } from '@arlert-dev/widget-embedded';

import { ToastProvider } from '@arlert-dev/ui';
import { Widget, WidgetProvider } from '@arlert-dev/widget-embedded';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PLAYGROUND_CONTAINER_ID } from './constants';
import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hooks/useTheme';
import { initialConfig, useConfigStore } from './store/config';
import { useMetaStore } from './store/meta';
import { RANGO_PUBLIC_API_KEY } from './utils/configs';
import { filterConfig } from './utils/export';

export function App() {
  const { activeStyle } = useTheme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const config = useConfigStore.use.config();
  const { filteredConfigForExport } = filterConfig(config, initialConfig);

  const overridedConfig: WidgetConfig = {
    theme: {},
    ...config,
    ...filteredConfigForExport,
    /*
     * externalWallets should be always true to avoid mounting WidgetProvider twice.
     * mounting multiple WidgetProviders may result in conflicts and unexpected behaviour.
     */
    externalWallets: true,
    apiKey: RANGO_PUBLIC_API_KEY,
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
