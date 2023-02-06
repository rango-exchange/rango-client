import { useNavigate } from 'react-router-dom';
import { SecondaryPage, styled, Wallet } from '@rangodev/ui';
import React, { useState } from 'react';
import { getlistWallet } from '../utils/wallets';
import { WalletType } from '@rangodev/wallets-shared';
import { useWallets } from '@rangodev/wallets-core';

const ListContainer = styled('div', {
    display: 'grid',
    gap: '.5rem',
    gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
    height: '450px',
    alignContent: 'baseline',
  });
export function WalletsPage() {
  const navigate = useNavigate();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const Wallets = getlistWallet(state, getWalletInfo, Object.values(WalletType));
  const [walletMessage, setWalletErrorMessage] = useState('');

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
    <SecondaryPage
      title="Select Wallet"
      textField={false}
      onBack={() => {
        navigate(-1);
      }}
      Content={
        <ListContainer>
          {Wallets.map((info, index) => (
            <Wallet {...info} key={index} onClick={onSelectWallet} />
          ))}
        </ListContainer>
      }
    />
  );
}
