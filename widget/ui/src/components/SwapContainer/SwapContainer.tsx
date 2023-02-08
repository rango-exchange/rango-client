import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';
import { Button } from '../Button';
import { AddWalletIcon } from '../Icon';
import { Typography } from '../Typography';

const MainContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '512px',
  minWidth: '375px',
  width: '100%',
  boxShadow: '$s',
  backgroundColor: '$background',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  padding: '$8',
});

const ContentContainer = styled('div', {
  width: '100%',
  // maxHeight: '600px',
});

export interface PropTypes {
  onConnectWallet: () => void;
  style?: React.CSSProperties;
}

export function SwapContainer(props: PropsWithChildren<PropTypes>) {
  const { onConnectWallet, children, style } = props;

  return (
    <MainContainer style={style}>
      <Button
        size="small"
        suffix={<AddWalletIcon size={20} />}
        variant="ghost"
        onClick={onConnectWallet}
      >
        <Typography variant="body2">Connect Wallet</Typography>
      </Button>
      <ContentContainer>{children}</ContentContainer>
    </MainContainer>
  );
}
