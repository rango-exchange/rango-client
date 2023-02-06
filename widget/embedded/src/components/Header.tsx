import React from 'react';
import { styled, Button, Typography } from '@rangodev/ui';
import { HeaderButtons } from './HeaderButtons';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '$16 $8',
});

export function Header() {
  return (
    <HeaderContainer>
      <Typography variant="h4">SWAP</Typography>
      <HeaderButtons />
    </HeaderContainer>
  );
}
