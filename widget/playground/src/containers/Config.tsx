import React, { PropsWithChildren, useState } from 'react';
import { Alert, Button, Divider, styled, Typography } from '@rango-dev/ui';
import { ChainsConfig } from '../components/ChainsConfig';
import { WalletsConfig } from '../components/WalletsConfig';
import { SourcesConfig } from '../components/SourcesConfig';
import { StylesConfig } from '../components/StylesConfig';
import { globalStyles } from '../globalStyles';
import { useMetaStore } from '../store/meta';
import { useConfigStore } from '../store/config';
import { ExportConfigModal } from '../components/ExportConfigModal';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral100',
  flexDirection: 'column',
  padding: '0 $24',
  '@lg': {
    flexDirection: 'row',
    alignItems: 'unset',
  },
});
const SwapContent = styled('div', {
  width: '100%',
  '@lg': {
    width: 'auto',
    flexBasis: '512px',
  },
});
const ConfigContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  '@lg': {
    paddingRight: '$24',
    marginBottom: '$32',
  },
});

const Swap = styled('div', {
  position: 'sticky',
  top: '$32',
  margin: '$32 0',
});

const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  flexDirection: 'column',
  padding: '$32 0',
  '@sm': {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const Description = styled(Typography, {
  paddingRight: '$24',
});

const HeaderButtonsContainer = styled('div', {
  paddingTop: '$16',
  display: 'flex',
  '@sm': {
    paddingTop: '0',
  },
});

const HeaderButton = styled(Button, {
  minWidth: 'max-content',
});

const ResetButton = styled(HeaderButton, {
  marginLeft: '$8',
});

export function Config(props: PropsWithChildren) {
  globalStyles();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const [open, setOpen] = useState<boolean>(false);
  const config = useConfigStore.use.config();
  const resetConfig = useConfigStore.use.resetConfig();

  return (
    <Container>
      <ConfigContent>
        <div>
          <Header>
            <div>
              <Typography variant="title" size="medium">
                Customize your widget
              </Typography>
              <Divider size={8} />
              <Description variant="body" size="medium" color="$neutral600">
                You can customize the theme and config how your widget should
                works
              </Description>
            </div>
            <HeaderButtonsContainer>
              <HeaderButton
                variant="contained"
                type="primary"
                onClick={() => setOpen(true)}>
                Export Code
              </HeaderButton>
              <Divider size={16} />
              <ResetButton
                variant="outlined"
                type="warning"
                onClick={resetConfig.bind(null)}>
                Reset Config
              </ResetButton>
            </HeaderButtonsContainer>
          </Header>
          {loadingStatus === 'failed' && (
            <Alert type="error">
              Error connecting server, please reload the app and try again
            </Alert>
          )}
          <Divider size={20} />
          <ChainsConfig type="Source" />
          <Divider size={32} />
          <ChainsConfig type="Destination" />
          <Divider size={32} />
          <WalletsConfig />
          <Divider size={32} />
          <SourcesConfig />
          <Divider size={32} />
          <StylesConfig />
          <Divider size={32} />
        </div>
      </ConfigContent>
      <SwapContent>
        <Swap>{props.children}</Swap>
      </SwapContent>
      <ExportConfigModal
        open={open}
        onClose={setOpen.bind(null, false)}
        config={config}
      />
    </Container>
  );
}
