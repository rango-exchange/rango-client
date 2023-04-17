import {
  Alert,
  SecondaryPage,
  styled,
  Wallet,
  WalletState,
  WalletInfo,
} from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { getlistWallet, sortWalletsBasedOnState } from '../utils/wallets';
import { WalletType, detectMobileScreens } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/wallets-core';

import { useUiStore } from '../store/ui';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useTranslation } from 'react-i18next';
import { useMetaStore } from '../store/meta';
import { Spinner } from '@rango-dev/ui';
import { LoadingFailedAlert } from '@rango-dev/ui';

interface PropTypes {
  supportedWallets: 'all' | WalletType[];
  multiWallets: boolean;
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  alignContent: 'baseline',
  padding: '0.5rem',
  overflowY: 'auto',
});

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  top: '50%',
});

const AlertContainer = styled('div', {
  paddingBottom: '$16',
});
export function WalletsPage({ supportedWallets, multiWallets }: PropTypes) {
  const { navigateBackFrom } = useNavigateBack();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const wallets = getlistWallet(
    state,
    getWalletInfo,
    supportedWallets === 'all' ? Object.values(WalletType) : supportedWallets
  );
  const walletsRef = useRef<WalletInfo[]>();

  let sortedWallets = detectMobileScreens()
    ? wallets.filter((wallet) => wallet.showOnMobile)
    : wallets;
  sortedWallets = sortWalletsBasedOnState(sortedWallets);
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const toggleConnectWalletsButton =
    useUiStore.use.toggleConnectWalletsButton();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const { t } = useTranslation();

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (walletErrorMessage) setWalletErrorMessage('');
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
      disconnect(wallet.type);
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
      title={t('Select Wallet') || ''}
      textField={false}
      onBack={navigateBackFrom.bind(null, navigationRoutes.wallets)}
    >
      <>
        {walletErrorMessage && (
          <AlertContainer>
            <Alert type="error">{walletErrorMessage}</Alert>
          </AlertContainer>
        )}
        {loadingMetaStatus === 'loading' && (
          <LoaderContainer className="loader">
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingMetaStatus === 'failed' && <LoadingFailedAlert />}
        <ListContainer>
          {loadingMetaStatus === 'success' &&
            sortedWallets.map((wallet, index) => (
              <Wallet
                {...wallet}
                key={`${index}-${wallet.type}`}
                onClick={onSelectWallet}
              />
            ))}
        </ListContainer>
      </>
    </SecondaryPage>
  );
}
