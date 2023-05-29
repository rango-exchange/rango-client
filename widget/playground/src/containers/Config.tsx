import React, { PropsWithChildren, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  Divider,
  styled,
  Typography,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { ChainsConfig } from '../components/ChainsConfig';
import { WalletsConfig } from '../components/WalletsConfig';
import { SourcesConfig } from '../components/SourcesConfig';
import { StylesConfig } from '../components/StylesConfig';
import { Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { globalStyles } from '../globalStyles';
import { useMetaStore } from '../store/meta';
import { initialConfig, useConfigStore } from '../store/config';
import { filterConfig, syntaxHighlight } from '../helpers';
import { ProvidersConfig } from '../components/ProvidersConfig';

const providers = allProviders();

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
  flexBasis: '512px',
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

const Pre = styled('pre', {
  fontSize: '$14',
  display: 'block',
  padding: '10px 30px',
  margin: 0,
  overflowY: 'auto',
  color: '$foreground',
  '.string': {
    color: '$warning',
  },
  '.key': {
    color: '$success',
  },
});

const Link = styled('a', {
  color: '$primary',
  paddingLeft: 4,
});

export function Config(props: PropsWithChildren) {
  globalStyles();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const [open, setOpen] = useState<boolean>(false);
  const config = useConfigStore.use.config();
  const resetConfig = useConfigStore.use.resetConfig();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  const { filteredConfigForExport, userSelectedConfig } = filterConfig(config, initialConfig);

  const resetButtonDisabled = !Object.entries(userSelectedConfig).length;

  return (
    <Container>
      <Provider providers={providers}>
        <ConfigContent>
          <div>
            <Header>
              <div>
                <Typography variant="h4">Customize your widget</Typography>
                <Divider size={8} />
                <Description variant="body2" color="$neutral600">
                  You can customize the theme and config how your widget should works
                </Description>
              </div>
              <HeaderButtonsContainer>
                <HeaderButton variant="contained" type="primary" onClick={() => setOpen(true)}>
                  Export Config
                </HeaderButton>
                <Divider size={16} />
                <ResetButton
                  variant="outlined"
                  type="error"
                  disabled={resetButtonDisabled}
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
            <ProvidersConfig />
            <Divider size={32} />

            <SourcesConfig />
            <Divider size={32} />
            <StylesConfig />
          </div>
        </ConfigContent>
      </Provider>
      <SwapContent>
        <Swap>{props.children}</Swap>
      </SwapContent>

      <Modal
        open={open}
        action={
          <Button
            type="primary"
            variant="ghost"
            onClick={() => handleCopy(JSON.stringify(filteredConfigForExport))}>
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        }
        onClose={() => setOpen(false)}
        content={
          <>
            <hr />
            <Typography variant="body1" mb={12} mt={12}>
              See full instruction on
              <Link
                href="https://docs.rango.exchange/integration-guide/rango-widget"
                target="_blank">
                docs.rango.exchange
              </Link>
            </Typography>

            <Pre
              {...(!!filteredConfigForExport && {
                dangerouslySetInnerHTML: {
                  __html: syntaxHighlight(JSON.stringify(filteredConfigForExport, undefined, 4)),
                },
              })}
            />
          </>
        }
        title="Exported Config"
        containerStyle={{ minWidth: '600px', height: '500px' }}
      />
    </Container>
  );
}
