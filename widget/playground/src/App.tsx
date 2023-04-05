import React from 'react';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';

export function App() {
  const { activeTheme } = useTheme();
  const configs = useConfigStore.use.configs();

  return (
    <div className={activeTheme}>
      <Config>
        <SwapBox configs={configs} />
      </Config>
    </div>
  );
}
