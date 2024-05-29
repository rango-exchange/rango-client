import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { ToastProvider } from '@rango-dev/ui';
import { Widget, WidgetProvider } from '@rango-dev/widget-embedded';
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
    ...filteredConfigForExport,
    apiKey: RANGO_PUBLIC_API_KEY,
    features: {
      theme: 'hidden',
    },
  };

  /*
   * Playground widget provider should contain all wallets so we need to remove 'wallets' from config
   * to make sure we can access to list of all wallets in playground
   */
  const playgroundConfig = { ...overridedConfig, wallets: undefined };

  useEffect(() => {
    void fetchMeta();
  }, []);

  return (
    <ToastProvider container={document.body}>
      <div id={PLAYGROUND_CONTAINER_ID} className={activeStyle}>
        <WidgetProvider config={playgroundConfig}>
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
