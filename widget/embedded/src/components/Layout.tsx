import { Button, AddWalletIcon, Typography, styled } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallets } from '@rangodev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import { AppRoutes } from './AppRoutes';
import { useWalletsStore } from '../store/wallets';
import { calculateWalletUsdValue, getSelectableWallets } from '../utils/wallets';

const Header = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
});

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginLeft: -15,
  marginRight: '$6',
  borderRadius: '99999px',
});

export function Layout() {
  const navigate = useNavigate();
  const { balances, accounts, selectedWallets } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const filterSelelectedWallets = getSelectableWallets(accounts, selectedWallets, getWalletInfo);
  const totalBalance = calculateWalletUsdValue(balances);

  return (
    <>
      <Header>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          flexContent
          onClick={() => navigate(navigationRoutes.wallets)}>
          {accounts?.length ? (
            filterSelelectedWallets.map((selectedWallet, index) => (
              <WalletImage key={index} src={selectedWallet.image} />
            ))
          ) : (
            <></>
          )}
          <Typography variant="body2">
            {!accounts?.length ? 'Connect Wallet' : `$${totalBalance || 0}`}
          </Typography>
        </Button>
      </Header>
      <AppRoutes />
    </>
  );
}
