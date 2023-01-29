import React from 'react';
import { styled } from '@stitches/react';
import { HistoryIcon, Setting, Tooltip, WalletIcon } from '@rangodev/ui';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

export function HeaderButtons() {
  return (
    <ButtonsContainer>
      <Tooltip content="Wallets">
        <WalletIcon size={24} />
      </Tooltip>
      <Tooltip content="Transactions Hitory">
        <HistoryIcon size={24} />
      </Tooltip>
      <Tooltip content="Settings">
        <Setting size={24} />
      </Tooltip>
    </ButtonsContainer>
  );
}
