import React from 'react';
import {
  HistoryIcon,
  SettingsIcon,
  Tooltip,
  WalletIcon,
  styled,
  AddWalletIcon,
} from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../../navigationRoutes';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

const StyledWalletIcon = styled(AddWalletIcon, {
  marginRight: '$24',
  cursor: 'pointer',
});

const StyledHistoryIcon = styled(HistoryIcon, { marginRight: '$16', cursor: 'pointer' });

const StyledSettingsIcon = styled(SettingsIcon, {
  cursor: 'pointer',
});

export function HeaderButtons() {
  const navigate = useNavigate();

  return (
    <ButtonsContainer>
      <Tooltip content="Transactions Hitory">
        <StyledHistoryIcon size={24} onClick={() => navigate(navigationRoutes.history)} />
      </Tooltip>
      <Tooltip content="Settings">
        <StyledSettingsIcon
          size={24}
          onClick={() => {
            navigate(navigationRoutes.settings);
          }}
        />
      </Tooltip>
    </ButtonsContainer>
  );
}
