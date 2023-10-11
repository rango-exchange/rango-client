import { Widget, WidgetWallets } from '@rango-dev/widget-embedded';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WC_PROJECT_ID } from './configs';
import { ConfigContainer } from './containers/configContainer';
import { useTheme } from './hook/useTheme';
import { useConfigStore } from './store/config';

export function App() {
  const { activeStyle } = useTheme();
  const config = useConfigStore.use.config();

  return (
    <div className={activeStyle}>
      <WidgetWallets
        providers={config.externalWallets ? config.wallets : []}
        options={{
          walletConnectProjectId: WC_PROJECT_ID,
        }}>
        <ConfigContainer>
          <Routes>
            <Route path="/*" element={<Widget config={config} />} />
          </Routes>
        </ConfigContainer>
      </WidgetWallets>
    </div>
  );
}
