import { Button, styled, SwapContainer, VerticalSwapIcon } from '@rangodev/ui';
import React from 'react';
import { Header } from '../components/swap/Header';
import { TokenInfo } from '../components/swap/TokenInfo';

const Container = styled('div', {
  padding: '$32 $16',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export function Home() {
  return (
    <Container>
      <Header />
      <TokenInfo type="From" />
      <VerticalSwapIcon size={36} style={{ cursor: 'pointer' }} />
      <TokenInfo type="To" />
      <Button type="primary" align="grow">
        Connect Wallet
      </Button>
    </Container>
  );
}
