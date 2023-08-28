import type { WidgetConfig } from '../types';
import type { WalletInfo } from '@rango-dev/ui';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import {
  Alert,
  Divider,
  LoadingFailedAlert,
  Spinner,
  styled,
  Typography,
  Wallet,
  WalletState,
} from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/wallets-react';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useMetaStore } from '../store/meta';
import { useUiStore } from '../store/ui';
import { configWalletsToWalletName } from '../utils/providers';
import { getlistWallet, sortWalletsBasedOnState } from '../utils/wallets';

interface PropTypes {
  supportedWallets: WidgetConfig['wallets'];
  multiWallets: boolean;
  config?: WidgetConfig;
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: ' repeat(3, minmax(0, 1fr))',
  alignContent: 'baseline',
  padding: '$15 $8 $20 0',
  overflowY: 'auto',
  height: 490,
});

const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  top: '50%',
});

const Container = styled('div', {
  textAlign: 'center',
});

const ALL_SUPPORTED_WALLETS = Object.values(WalletTypes);

export function WalletsPage({
  supportedWallets,
  multiWallets,
  config,
}: PropTypes) {
  const { navigateBackFrom } = useNavigateBack();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const wallets = getlistWallet(
    state,
    getWalletInfo,
    configWalletsToWalletName(supportedWallets, {
      walletConnectProjectId: config?.walletConnectProjectId,
    }) || ALL_SUPPORTED_WALLETS
  );
  const walletsRef = useRef<WalletInfo[]>();

  const sortedWallets = sortWalletsBasedOnState(wallets);
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const toggleConnectWalletsButton =
    useUiStore.use.toggleConnectWalletsButton();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (walletErrorMessage) {
        setWalletErrorMessage('');
      }
      if (wallet.connected) {
        await disconnect(type);
      } else {
        if (
          !multiWallets &&
          !!wallets.find((w) => w.state === WalletState.CONNECTED)
        ) {
          return;
        }
        await connect(type);
      }
    } catch (e) {
      setWalletErrorMessage('Error: ' + (e as any)?.message);
    }
  };
  const disconnectConnectingWallets = () => {
    const connectingWallets =
      walletsRef.current?.filter(
        (wallet) => wallet.state === WalletState.CONNECTING
      ) || [];
    for (const wallet of connectingWallets) {
      void disconnect(wallet.type);
    }
  };
  useEffect(() => {
    toggleConnectWalletsButton();
    return () => {
      disconnectConnectingWallets();
      toggleConnectWalletsButton();
    };
  }, []);

  useEffect(() => {
    walletsRef.current = wallets;
  }, [wallets]);

  return (
    <Layout
      header={{
        title: i18n.t('Connect Wallets'),
        onBack: navigateBackFrom.bind(null, navigationRoutes.wallets),
      }}>
      <Container>
        {walletErrorMessage && (
          <>
            <Alert type="error" title={walletErrorMessage} />
            <Divider direction="vertical" size={16} />
          </>
        )}
        {loadingMetaStatus === 'loading' && (
          <LoaderContainer className="loader">
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingMetaStatus === 'failed' && <LoadingFailedAlert />}
        <Typography variant="title" size="xmedium" align="center">
          Choose a wallet to connect.
        </Typography>
        <ListContainer>
          {loadingMetaStatus === 'success' &&
            sortedWallets.map((wallet, index) => {
              const key = `wallet-${index}-${wallet.type}`;
              return (
                <Wallet
                  {...wallet}
                  key={key}
                  onClick={(type) => {
                    void onSelectWallet(type);
                  }}
                />
              );
            })}
        </ListContainer>
      </Container>
    </Layout>
  );
}
