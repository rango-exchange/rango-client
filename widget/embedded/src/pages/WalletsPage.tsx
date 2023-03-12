import {
  Alert,
  SecondaryPage,
  styled,
  Wallet,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { getlistWallet } from '../utils/wallets';
import { WalletType } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/wallets-core';
import { useUiStore } from '../store/ui';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';

const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  height: '450px',
  alignContent: 'baseline',
});

const AlertContainer = styled('div', {
  paddingBottom: '$16',
});
export function WalletsPage() {
  const { navigateBackFrom } = useNavigateBack();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const wallets = getlistWallet(
    state,
    getWalletInfo,
    Object.values(WalletType)
  );
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const toggleConnectWalletsButton =
    useUiStore.use.toggleConnectWalletsButton();

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (walletErrorMessage) setWalletErrorMessage('');
      if (wallet.connected) {
        await disconnect(type);
      } else {
        await connect(type);
      }
    } catch (e) {
      setWalletErrorMessage('Error: ' + e.message);
    }
  };

  useEffect(() => {
    toggleConnectWalletsButton();
    return () => toggleConnectWalletsButton();
  }, []);

  return (
    <SecondaryPage
      title="Select Wallet"
      textField={false}
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
          {wallets.map((info, index) => (
            <Wallet {...info} key={index} onClick={onSelectWallet} />
          ))}
        </ListContainer>
      </>
    </SecondaryPage>
  );
}
