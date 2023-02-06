import React from 'react';
import { SettingsIcon, Tooltip, styled, AddWalletIcon, Button } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

export function HeaderButtons() {
  const navigate = useNavigate();

  return (
    <ButtonsContainer>
      <Tooltip content="Transactions History">
        <Button variant="ghost" onClick={() => navigate(navigationRoutes.history)}>
          <AddWalletIcon size={24} />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button variant="ghost" onClick={() => navigate(navigationRoutes.settings)}>
          <SettingsIcon size={24} />
        </Button>
      </Tooltip>
    </ButtonsContainer>
  );
}
