import React, { useEffect } from 'react';
import { useMetaStore } from './store/meta';
import { Config } from './containers/Config';
import { SwapBox } from '@rango-dev/widget-embedded';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});
const SwapContent = styled('div', {
  position: 'sticky',
  top: 0,
  marginTop: 115,
});
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
