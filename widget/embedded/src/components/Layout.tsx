import { Button, AddWalletIcon, Typography, styled } from '@rangodev/ui';
import React from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { AppRoutes } from './AppRoutes';

const Header = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
});

export function Layout() {
  const navigate = useNavigate();
  return (
    <>
      <Header>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          onClick={() => navigate(navigationRoutes.wallets)}>
          <Typography variant="body2">Connect Wallet</Typography>
        </Button>
      </Header>
      <AppRoutes />
    </>
  );
}
