import {
  Alert,
  SecondaryPage,
  styled,
  Wallet,
  Typography,
  WalletState,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { getlistWallet, sortWalletsBasedOnState } from '../utils/wallets';
import { WalletType, detectMobileScreens } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/wallets-core';

import { useUiStore } from '../store/ui';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useTranslation } from 'react-i18next';

interface PropTypes {
  supportedWallets: 'all' | WalletType[];
  multiWallets: boolean;
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  height: '450px',
  alignContent: 'baseline',
  padding: '0 0.5rem',
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

  let sortedWallets = detectMobileScreens()
    ? wallets.filter((wallet) => wallet.showOnMobile)
    : wallets;
  sortedWallets = sortWalletsBasedOnState(sortedWallets);
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const toggleConnectWalletsButton =
    useUiStore.use.toggleConnectWalletsButton();
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

  useEffect(() => {
    toggleConnectWalletsButton();
    return () => toggleConnectWalletsButton();
  }, []);

  return (
    <SecondaryPage
      title={t('Select Wallet') || ''}
      hasSearch={false}
      onBack={navigateBackFrom.bind(null, navigationRoutes.wallets)}
    >
      <>
        {walletErrorMessage && (
          <AlertContainer>
            <Alert type="error">
              <Typography variant="body2">{walletErrorMessage}</Typography>
            </Alert>
          </AlertContainer>
        )}
        <ListContainer>
          {sortedWallets.map((wallet, index) => (
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
