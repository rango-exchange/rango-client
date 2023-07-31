import React from 'react';
import { Config } from './containers/Config';
import { Widget, WidgetWallets } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';
import { Route, Routes } from 'react-router-dom';
import { WC_PROJECT_ID } from './configs';

export function App() {
  const { activeStyle } = useTheme();
  const config = useConfigStore.use.config();

  return (
    <div className={activeStyle}>
      {config.externalWallets ? (
        <WidgetWallets
          providers={config.wallets}
          options={{
            walletConnectProjectId: WC_PROJECT_ID,
          }}>
          <Config>
            <Routes>
              <Route path="/*" element={<Widget config={config} />} />
            </Routes>
          </Config>
        </WidgetWallets>
      ) : (
        <Config>
          <Routes>
            <Route path="/*" element={<Widget config={config} />} />
          </Routes>
        </Config>
      )}
    </div>
  );
}
