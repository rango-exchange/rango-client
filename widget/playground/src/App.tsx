import { Widget, WidgetWallets } from '@rango-dev/widget-embedded';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hooks/useTheme';
import { useConfigStore } from './store/config';
import { useMetaStore } from './store/meta';
import { RANGO_PUBLIC_API_KEY, WC_PROJECT_ID } from './utils/configs';

export function App() {
  const { activeStyle } = useTheme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const config = useConfigStore.use.config();

  const overridedConfig = { ...config, apiKey: RANGO_PUBLIC_API_KEY };
  useEffect(() => {
    void fetchMeta();
  }, []);

  return (
    <div className={activeStyle}>
      <WidgetWallets
        providers={config.externalWallets ? config.wallets : []}
        options={{
          walletConnectProjectId: WC_PROJECT_ID,
        }}>
        <ConfigContainer>
          <Routes>
            <Route path="/*" element={<Widget config={overridedConfig} />} />
          </Routes>
        </ConfigContainer>
      </WidgetWallets>
    </div>
  );
}
