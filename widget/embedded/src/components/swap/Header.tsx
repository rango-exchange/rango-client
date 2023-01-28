import React from 'react';
import { styled } from '@stitches/react';
import { Typography } from '@rangodev/ui';
import { HeaderButtons } from './HeaderButtons';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export function Header() {
  return (
    <HeaderContainer>
      <Typography variant="h3">Swap</Typography>
      <HeaderButtons />
    </HeaderContainer>
  );
}
