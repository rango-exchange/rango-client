import React from 'react';
import { Config } from './containers/Config';
import { Widget } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';

export function App() {
  const { activeTheme } = useTheme();
  const config = useConfigStore.use.config();

  return (
    <div className={activeTheme}>
      <Config>
        <Widget config={config} />
      </Config>
    </div>
  );
}
