import React, { useEffect } from 'react';
import { Spacer, styled, Typography } from '@rangodev/ui';
import { ChainsConfig } from './components/ChainsConfig';
import { WalletsConfig } from './components/WalletsConfig';
import { SourcesConfig } from './components/SourcesConfig';
import { StylesConfig } from './components/StylesConfig';
import { Provider } from '@rangodev/wallets-core';
import { useMetaStore } from './store/meta';
import { allProviders } from '@rangodev/provider-all';
import SwapBox from '@rangodev/widget-embedded';

const providers = allProviders();

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
    <Container>
      <Provider providers={providers}>
        <div>
          <Typography variant="h1">Configuration</Typography>
          <Spacer size={20} direction="vertical" />
          <ChainsConfig type="Source" />
          <Spacer size={24} direction="vertical" />
          <ChainsConfig type="Destination" />
          <Spacer size={24} direction="vertical" />
          <WalletsConfig />
          <Spacer size={24} direction="vertical" />
          <SourcesConfig />
          <Spacer size={24} direction="vertical" />
          <StylesConfig />
        </div>
      </Provider>
      <Spacer size={24} />
      <div>
        <SwapContent>
          {/*@ts-ignore */}
          <SwapBox />
        </SwapContent>
      </div>
    </Container>
  );
}
