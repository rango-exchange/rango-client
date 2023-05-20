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
import { useConfigStore } from '../store/config';
import { filterConfig, syntaxHighlight } from '../helpers';

const providers = allProviders();

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '$neutral100',
});
const SwapContent = styled('div', {
  flexBasis: '512px',
});
const ConfigContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  paddingRight: '$24',
});

const Swap = styled('div', {
  position: 'sticky',
  top: 0,
  marginTop: 32,
});

const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$32 0',
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
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  const filtered = filterConfig(config);

  return (
    <Container>
      <Provider providers={providers}>
        <ConfigContent>
          <div>
            <Header>
              <div>
                <Typography variant="h4">Customize your widget</Typography>
                <Divider size={8} />
                <Typography variant="body2" color="$neutral600">
                  You can customize the theme and config how your widget should works
                </Typography>
              </div>
              <Button variant="contained" type="primary" onClick={() => setOpen(true)}>
                Export Config
              </Button>
            </Header>
            {loadingStatus === 'failed' && (
              <Alert type="error">
                Error connecting server, please reload the app and try again
              </Alert>
            )}
            <Divider size={20} direction="vertical" />
            <ChainsConfig type="Source" />
            <Divider size={32} />
            <ChainsConfig type="Destination" />
            <Divider size={32} />
            <WalletsConfig />
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
            onClick={() => handleCopy(JSON.stringify(filtered))}>
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
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(JSON.stringify(filtered, undefined, 4)),
              }}
            />
          </>
        }
        title="Exported Config"
        containerStyle={{ minWidth: '600px', height: '500px' }}
      />
    </Container>
  );
}
