import { Button, styled, SwapContainer, VerticalSwap } from '@rangodev/ui';
import React from 'react';
import { Header } from '../components/swap/Header';
import { TokenInfo } from '../components/swap/TokenInfo';

const MainContainer = styled('div', {
  padding: '$16',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export function Swap() {
  return (
    <SwapContainer>
      <MainContainer>
        <Header />
        <TokenInfo label="From" />
        <VerticalSwap size={24} />
        <TokenInfo label="To" />
        <Button type="primary" align="grow">
          Connect Wallet
        </Button>
      </MainContainer>
    </SwapContainer>
  );
}
