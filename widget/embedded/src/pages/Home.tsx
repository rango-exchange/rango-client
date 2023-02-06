import { BestRoute, Button, styled, VerticalSwapIcon } from '@rangodev/ui';
import React, { useState } from 'react';
import { Header } from '../components/Home/Header';
import { TokenInfo } from '../components/Home/TokenInfo';
import { useBestRouteStore } from '../store/bestRoute';
import { BottomLogo } from '../components/Home/BottomLogo';
import { useInRouterContext } from 'react-router-dom';
import { SwithFromAndTo } from '../router/SwitchFromAndTo';

const Container = styled('div', {
  padding: '$32 $16 $16 $16',
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
    inputAmount,
    setInputAmount,
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
      <TokenInfo
        type="From"
        chain={fromChain}
        token={fromToken}
        onAmountChange={setInputAmount}
        inputAmount={inputAmount}
      />
      <Button variant="ghost" onClick={swithFromAndTo}>
        <VerticalSwapIcon size={36} />
        {isRouterInContext && <SwithFromAndTo count={count} />}
      </Button>
      <TokenInfo type="To" chain={toChain} token={toToken} />
      <BestRoute />
      <Button type="primary" align="grow" size="large">
        Connect Wallet
      </Button>
      <BottomLogo />
    </Container>
  );
}
