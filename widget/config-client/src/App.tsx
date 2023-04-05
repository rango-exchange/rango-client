import React, { useEffect } from 'react';
import { useMetaStore } from './store/meta';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';

export function App() {
  const fetchMeta = useMetaStore((state) => state.fetchMeta);
  const { configs } = useConfigStore((state) => state);

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();
  }, []);

  return (
    <Config>
      <SwapBox configs={configs} />
    </Config>
  );
}
