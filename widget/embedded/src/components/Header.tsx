import React from 'react';
import { styled, Typography } from '@rangodev/ui';
import { HeaderButtons } from './HeaderButtons';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '$16 0',
});

export interface PropTypes {
  onClickRefresh: () => void;
}

export function Header(props: PropTypes) {
  const { onClickRefresh } = props;
  return (
    <HeaderContainer>
      <Typography variant="h4">SWAP</Typography>
      <HeaderButtons onClickRefresh={onClickRefresh} />
    </HeaderContainer>
  );
}
