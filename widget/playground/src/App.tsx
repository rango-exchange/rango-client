import { Widget, WidgetProvider } from '@rango-dev/widget-embedded';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PLAYGROUND_CONTAINER_ID } from './constants';
import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hooks/useTheme';
import { useConfigStore } from './store/config';
import { useMetaStore } from './store/meta';
import { RANGO_PUBLIC_API_KEY } from './utils/configs';

export function App() {
  const { activeStyle } = useTheme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const config = useConfigStore.use.config();

  const overridedConfig = { ...config, apiKey: RANGO_PUBLIC_API_KEY };
  useEffect(() => {
    void fetchMeta();
  }, []);

  return (
    <div id={PLAYGROUND_CONTAINER_ID} className={activeStyle}>
      <WidgetProvider config={overridedConfig}>
        <ConfigContainer>
          <Routes>
            <Route path="/*" element={<Widget config={overridedConfig} />} />
          </Routes>
        </ConfigContainer>
      </WidgetProvider>
    </div>
  );
}
