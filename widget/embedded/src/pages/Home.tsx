import { Button, styled, SwapContainer, VerticalSwapIcon } from '@rangodev/ui';
import React from 'react';
import { Header } from '../components/swap/Header';
import { TokenInfo } from '../components/swap/TokenInfo';
import { useRouteStore } from '../store/route';

const Container = styled('div', {
  padding: '$32 $16',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export function Home() {
  const { fromChain, fromToken, toChain, toToken } = useRouteStore();

  return (
    <Container>
      <Header />
      <TokenInfo type="From" chain={fromChain} token={fromToken} />
      <VerticalSwapIcon size={36} style={{ cursor: 'pointer' }} />
      <TokenInfo type="To" chain={toChain} token={toToken} />
      <Button type="primary" align="grow" size="large">
        Connect Wallet
      </Button>
    </Container>
  );
}
