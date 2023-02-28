import React, { useEffect } from 'react';
import { useMetaStore } from './store/meta';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';

export function App() {
  const fetchMeta = useMetaStore((state) => state.fetchMeta);

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();
  }, []);

  return (
    <Config>
      <SwapBox />
    </Config>
  );
}
