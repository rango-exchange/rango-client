import { BestRoute, Button, styled, SwapContainer, VerticalSwapIcon } from '@rangodev/ui';
import { BestRouteType } from '@rangodev/ui/dist/types/swaps';
import React from 'react';
import { Header } from '../components/swap/Header';
import { TokenInfo } from '../components/swap/TokenInfo';
import { useBestRouteStore } from '../store/bestRoute';
import { BottomLogo } from '../components/swap/BottomLogo';
import { useInRouterContext, useParams, useSearchParams } from 'react-router-dom';

const Container = styled('div', {
  padding: '$32 $16 $16 $16',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export function Home() {
  const isRouterInContex = useInRouterContext();
  const [searchParams, setSearchParams] = useSearchParams();
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
    if (isRouterInContex) {
      //todo: refactor and replace strings with constants
      const fChain = searchParams.get('fromChain');
      const fToken = searchParams.get('fromToken');
      const tChain = searchParams.get('toChain');
      const tToken = searchParams.get('toToken');
      setSearchParams({
        ...(tChain && { fromChain: tChain }),
        ...(tToken && { fromToken: tToken }),
        ...(fChain && { toChain: fChain }),
        ...(fToken && { toToken: fToken }),
      });
    }
  };

  return (
    <Container>
      <Header />
      <TokenInfo type="From" chain={fromChain} token={fromToken} />
      <Button variant="ghost" onClick={swithFromAndTo}>
        <VerticalSwapIcon size={36} />
      </Button>
      <TokenInfo type="To" chain={toChain} token={toToken} />
      <Button type="primary" align="grow" size="large">
        Connect Wallet
      </Button>
      <BottomLogo />
    </Container>
  );
}
