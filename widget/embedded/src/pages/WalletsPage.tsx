import type { WidgetConfig } from '../types';
import type { WalletInfo } from '@rango-dev/ui';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import {
  Alert,
  LoadingFailedAlert,
  SecondaryPage,
  Spinner,
  styled,
  Typography,
  Wallet,
  WalletState,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-core';
import { WalletTypes } from '@rango-dev/wallets-shared';
import React, { useEffect, useRef, useState } from 'react';

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
  padding: '$15 $20 $20',
  overflowY: 'auto',
});

const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  top: '50%',
});

const AlertContainer = styled('div', {
  paddingBottom: '$16',
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
    <SecondaryPage
      title={i18n.t('Select Wallet') || ''}
      textField={false}
      onBack={navigateBackFrom.bind(null, navigationRoutes.wallets)}>
      <>
        {walletErrorMessage && (
          <AlertContainer>
            <Alert type="error" title={walletErrorMessage} />
          </AlertContainer>
        )}
        {loadingMetaStatus === 'loading' && (
          <LoaderContainer className="loader">
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingMetaStatus === 'failed' && <LoadingFailedAlert />}
        <Typography variant="title" size="medium" align="center">
          Choose a wallet to connect.
        </Typography>
        <ListContainer>
          {loadingMetaStatus === 'success' &&
            sortedWallets.map((wallet, index) => (
              <Wallet
                {...wallet}
                key={`${index}-${wallet.type}`}
                onClick={(type) => {
                  void onSelectWallet(type);
                }}
              />
            ))}
        </ListContainer>
      </>
    </SecondaryPage>
  );
}
