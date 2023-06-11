import React, { PropsWithChildren, useState } from 'react';
import {
  Alert,
  Button,
  ConnectWalletsModal,
  Divider,
  styled,
  Typography,
} from '@rango-dev/ui';
import { ChainsConfig } from '../components/ChainsConfig';
import { WalletsConfig } from '../components/WalletsConfig';
import { SourcesConfig } from '../components/SourcesConfig';
import { StylesConfig } from '../components/StylesConfig';
import { Provider, ProviderInterface } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { globalStyles } from '../globalStyles';
import { useMetaStore } from '../store/meta';
import { useConfigStore } from '../store/config';
import { ExportConfigModal } from '../components/ExportConfigModal';
import { useWallets } from '@rango-dev/widget-embedded';
import { Container as WalletContainer } from '../components/MultiSelect/Container';
import { WalletType, WalletTypes } from '@rango-dev/wallets-shared';
import { excludedWallets, getStateWallet } from '../helpers';

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
  const { state, connect, disconnect, getWalletInfo } = useWallets();
  const [openWalletsModal, setOpenWalletsModal] = useState<boolean>(false);
  const wallets = useConfigStore.use.config().wallets;
  const [walletMessage, setWalletErrorMessage] = useState('');

  const connectableWalletsList = (
    wallets ||
    Object.values(WalletTypes).filter(
      (wallet) => !excludedWallets.includes(wallet)
    )
  ).map((w) => {
    const type =
      typeof w !== 'string' ? (w as ProviderInterface).config.type : w;

    const {
      name,
      img: image,
      installLink,
      showOnMobile,
    } = getWalletInfo(type as string);
    return {
      state: getStateWallet(state(type as WalletType)),
      installLink,
      name,
      image,
      type,
      showOnMobile: !!showOnMobile,
    };
  });

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (wallet.connected) {
        await disconnect(type);
      } else {
        await connect(type);
      }
    } catch (e) {
      if (e instanceof Error) {
        setWalletErrorMessage('Error: ' + e.message);
      }
    }
  };

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
            <WalletContainer
              label="Connect/Disconnect To Wallets"
              titleBtn="Connect/Disconnect"
              onOpenModal={() => setOpenWalletsModal(true)}
            />
            <ConnectWalletsModal
              list={connectableWalletsList}
              open={openWalletsModal}
              onClose={() => {
                setOpenWalletsModal(false);
              }}
              onSelect={onSelectWallet}
              error={walletMessage}
            />
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
      </Provider>
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
