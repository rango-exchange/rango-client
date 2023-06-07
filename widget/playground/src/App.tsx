import React from 'react';
import { Config } from './containers/Config';
import { Widget } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';
import { Route, Routes } from 'react-router-dom';
import { useExternalProvidersStore } from './store/externalProviders';

export function App() {
  const { activeTheme } = useTheme();
  const config = useConfigStore.use.config();
  const { manageProviders: manageExternalProviders, providers: externalProviders } =
    useExternalProvidersStore.use.external();

  return (
    <div className={activeTheme}>
      <Config>
        <Routes>
          <Route
            path="/*"
            element={
              <Widget
                config={{
                  ...config,
                  externalProviders,
                  manageExternalProviders,
                }}
              />
            }
          />
        </Routes>
      </Config>
    </div>
  );
}
