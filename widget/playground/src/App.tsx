import { Widget, WidgetWallets } from '@rango-dev/widget-embedded';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { RANGO_PUBLIC_API_KEY, WC_PROJECT_ID } from './configs';
import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hook/useTheme';
import { useConfigStore } from './store/config';

export function App() {
  const { activeStyle } = useTheme();
  const config = useConfigStore.use.config();

  const overridedConfig = { ...config, apiKey: RANGO_PUBLIC_API_KEY };

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
