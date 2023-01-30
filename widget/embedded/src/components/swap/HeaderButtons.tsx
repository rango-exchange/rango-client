import React from 'react';
import { HistoryIcon, SettingsIcon, Tooltip, WalletIcon, styled } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

const StyledWalletIcon = styled(WalletIcon, {
  marginRight: '$16',
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
      <Tooltip content="Connect Wallets">
        <StyledWalletIcon size={24} />
      </Tooltip>
      <Tooltip content="Transactions Hitory">
        <StyledHistoryIcon size={24} />
      </Tooltip>
      <Tooltip content="Settings">
        <StyledSettingsIcon
          size={24}
          onClick={() => {
            navigate('/settings');
          }}
        />
      </Tooltip>
    </ButtonsContainer>
  );
}
