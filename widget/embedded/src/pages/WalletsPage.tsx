import { useNavigate } from 'react-router-dom';
import { Alert, SecondaryPage, styled, Wallet } from '@rango-dev/ui';
import React, { useState } from 'react';
import { getlistWallet } from '../utils/wallets';
import { WalletType } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/wallets-core';

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
  const navigate = useNavigate();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const wallets = getlistWallet(state, getWalletInfo, Object.values(WalletType));
  const [walletErrorMessage, setWalletErrorMessage] = useState('');

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
  return (
    <SecondaryPage
      title="Select Wallet"
      textField={false}
      onBack={() => {
        navigate(-1);
      }}
      Content={
        <>
          {walletErrorMessage && (
            <AlertContainer>
              <Alert type="error" description={walletErrorMessage} />
            </AlertContainer>
          )}
          <ListContainer>
            {wallets.map((info, index) => (
              <Wallet {...info} key={index} onClick={onSelectWallet} />
            ))}
          </ListContainer>
        </>
      }
    />
  );
}
