import { BestRoute, Button, styled, VerticalSwapIcon } from '@rangodev/ui';
import React, { useEffect, useState } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TokenInfo } from '../components/TokenInfo';
import { useBestRouteStore } from '../store/bestRoute';
import { BottomLogo } from '../components/BottomLogo';
import { SwithFromAndTo } from '../components/SwitchFromAndTo';
import { Footer } from '../components/Footer';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useBestRoute } from '../hooks/useBestRoute';
import BigNumber from 'bignumber.js';
import { ZERO } from '../utils/balance';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import { useMetaStore } from '../store/meta';
import { useWalletsStore } from '../store/wallets';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const BestRouteContainer = styled('div', {
  width: '100%',
  padding: '0 $16',
});

export function Home() {
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();
  const { inputAmount, setInputAmount } = useBestRouteStore();
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
    setBestRoute,
  } = useBestRouteStore();

  const { loadingStatus } = useMetaStore();
  const { balance, accounts } = useWalletsStore();
  console.log('balance:', balance, 'accounts:', accounts);

  const swithFromAndTo = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(fromChain);
    setToToken(fromToken);
    setCount((prev) => prev + 1);
  };

  const { data, loading, error, retry } = useBestRoute();

  useEffect(() => {
    setBestRoute(data);
  }, [data]);

  const outputAmount = !!data?.result?.outputAmount
    ? new BigNumber(data?.result?.outputAmount)
    : null;

  const outUsdValue: BigNumber = (outputAmount || ZERO).multipliedBy(
    (!loading && getBestRouteToTokenUsdPrice(data)) || toToken?.usdPrice || 0,
  );

  const showBestRoute = inputAmount && (!!data || loading || error);

  const buttonDisabled = loading || (!data && loadingStatus != 'success');

  const buttonTitle = balance.length === 0 ? 'Connect Wallet' : 'Swap';

  return (
    <Container>
      <Header onClick={retry} />
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
      <TokenInfo
        type="To"
        chain={toChain}
        token={toToken}
        outputAmount={outputAmount}
        outputUsdValue={outUsdValue}
      />
      {showBestRoute && (
        <BestRouteContainer>
          <BestRoute error={error} loading={loading} data={data} />
        </BestRouteContainer>
      )}
      <Footer>
        <Button
          type="primary"
          align="grow"
          size="large"
          disabled={buttonDisabled}
          onClick={() => {
            if (buttonTitle === 'Connect Wallet') navigate(navigationRoutes.wallets);
            else {
              navigate(navigationRoutes.confirmSwap);
            }
          }}>
          {buttonTitle}
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
