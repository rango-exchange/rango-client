import React, { PropsWithChildren, useState } from 'react';
import { Alert, Button, Modal, Spacer, styled, Typography, useCopyToClipboard } from '@rango-dev/ui';
import { ChainsConfig } from '../components/ChainsConfig';
import { WalletsConfig } from '../components/WalletsConfig';
import { SourcesConfig } from '../components/SourcesConfig';
import { StylesConfig } from '../components/StylesConfig';
import { Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { globalStyles } from '../globalStyles';
import { useMetaStore } from '../store/meta';
import { useConfigStore } from '../store/config';

const providers = allProviders();

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '$neutrals300',
});
const SwapContent = styled('div', {
  width: '100%',
});
const ConfigContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  width: '100%',
});

const Swap = styled('div', {
  position: 'sticky',
  top: 0,
  marginTop: 115,
});

const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Pre = styled('pre', {
  fontSize: '$14',
  display: 'block',
  padding: '10px 30px',
  margin: 0,
  overflowY: 'scroll',
  color:"$foreground"
});

export function Config(props: PropsWithChildren) {
  globalStyles();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const [open, setOpen] = useState<boolean>(false);
  const config = useConfigStore.use.config();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  return (
    <Container>
      <Provider providers={providers}>
        <ConfigContent>
          <div>
            <Header>
              <Typography variant="h1">Configuration</Typography>
              <Button variant="contained" type="primary" onClick={() => setOpen(true)}>
                Export Config
              </Button>
            </Header>
            {loadingStatus === 'failed' && (
              <Alert type="error">
                Error connecting server, please reload the app and try again
              </Alert>
            )}
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
        </ConfigContent>
      </Provider>
      <Spacer size={24} />
      <SwapContent>
        <Swap>{props.children}</Swap>
      </SwapContent>

      <Modal
        open={open}
        action={
          <Button type="primary" variant="ghost" onClick={() => handleCopy(JSON.stringify(config))}>
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        }
        onClose={() => setOpen(false)}
        content={
          <>
            <hr />
            <Pre> {JSON.stringify(config, null, 2)}</Pre>
          </>
        }
        title="Export Widget Config"
        containerStyle={{ width: '560px', height: '500px' }}
      />
    </Container>
  );
}
