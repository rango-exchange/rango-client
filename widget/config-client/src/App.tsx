import React from 'react';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';

export function App() {
  const { configs } = useConfigStore((state) => state);
  const { activeTheme } = useTheme();

  return (
    <div className={activeTheme}>
      <Config>
        <SwapBox configs={configs} />
      </Config>
    </div>
  );
}
