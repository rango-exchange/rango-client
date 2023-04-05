import React from 'react';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';

export function App() {
  const { configs } = useConfigStore((state) => state);

  return (
    <Config>
      <SwapBox configs={configs} />
    </Config>
  );
}
