import { Button, styled, VerticalSwapIcon } from '@rangodev/ui';
import React, { useState } from 'react';
import { useInRouterContext } from 'react-router-dom';
import { Header } from '../components/Header';
import { TokenInfo } from '../components/TokenInfo';
import { useBestRouteStore } from '../store/bestRoute';
import { BottomLogo } from '../components/BottomLogo';
import { SwithFromAndTo } from '../components/SwitchFromAndTo';
import { Footer } from '../components/Footer';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export function Home() {
  const isRouterInContext = useInRouterContext();
  const [count, setCount] = useState(0);
  const {
    fromChain,
    fromToken,
    toChain,
    toToken,
    setFromChain,
    setFromToken,
    setToChain,
    setToToken,
  } = useBestRouteStore();

  const swithFromAndTo = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(fromChain);
    setToToken(fromToken);
    setCount((prev) => prev + 1);
  };

  return (
    <Container>
      <Header />
      <TokenInfo type="From" chain={fromChain} token={fromToken} />
      <Button variant="ghost" onClick={swithFromAndTo}>
        <VerticalSwapIcon size={36} />
        {isRouterInContext && <SwithFromAndTo count={count} />}
      </Button>
      <TokenInfo type="To" chain={toChain} token={toToken} />
      <Footer>
        <Button type="primary" align="grow" size="large">
          Connect Wallet
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
