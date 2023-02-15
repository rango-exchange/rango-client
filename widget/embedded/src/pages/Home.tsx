import { Alert, BestRoute, Button, styled, VerticalSwapIcon } from '@rangodev/ui';
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
import { useMetaStore } from '../store/meta';
import { useWalletsStore } from '../store/wallets';
import { BestRouteType } from '@rangodev/ui/dist/types/swaps';
import { errorMessages } from '../constants/errors';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const SwitchButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  top: '11px',
});

const BestRouteContainer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});

const Alerts = styled('div', {
  paddingTop: '$16',
});

export function Home() {
  const [waningMessage, setWarningMessage] = useState('');
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();
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
    inputUsdValue,
    inputAmount,
    setInputAmount,
    outputAmount,
    outputUsdValue,
    bestRoute,
  } = useBestRouteStore();

  const { loadingStatus } = useMetaStore();
  const { balance, accounts, initSelectedWallets } = useWalletsStore();

  const swithFromAndTo = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(fromChain);
    setToToken(fromToken);
    setInputAmount(outputAmount?.toString() || '');
    setCount((prev) => prev + 1);
  };

  const { data, loading, error: bestRouteError, retry } = useBestRoute();

  const errorMessage =
    loadingStatus === 'failed' ? errorMessages.genericServerError : bestRouteError;

  useEffect(() => {
    setBestRoute(data as BestRouteType);
  }, [data]);

  const showBestRoute = inputAmount && (!!data || loading || bestRouteError);

  const hasLimitError =
    !loading &&
    !!bestRoute?.result &&
    (bestRoute?.result?.swaps || []).filter((swap) => {
      const minimum = !!swap.fromAmountMinValue ? new BigNumber(swap.fromAmountMinValue) : null;
      const maximum = !!swap.fromAmountMaxValue ? new BigNumber(swap.fromAmountMaxValue) : null;
      const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';
      return (
        (!isExclusive &&
          ((!!minimum && minimum?.gt(swap.fromAmount)) ||
            (!!maximum && maximum?.lt(swap.fromAmount)))) ||
        (isExclusive &&
          ((!!minimum && minimum?.gte(swap.fromAmount)) ||
            (!!maximum && maximum?.lte(swap.fromAmount))))
      );
    }).length > 0;

  const outToInRatio =
    inputUsdValue === null || inputUsdValue.lte(ZERO)
      ? 0
      : outputUsdValue === null || outputUsdValue.lte(ZERO)
      ? 0
      : outputUsdValue.div(inputUsdValue).minus(1).multipliedBy(100);

  const outToRatioHasWarning =
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (inputUsdValue === null || inputUsdValue.gte(new BigNumber(200)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (inputUsdValue === null || inputUsdValue.gte(new BigNumber(1000))));

  const priceImpactCanNotBeComputed =
    (inputUsdValue === null ||
      inputUsdValue.lte(ZERO) ||
      outputUsdValue === null ||
      outputUsdValue.lte(ZERO)) &&
    inputAmount !== '' &&
    inputAmount !== '0' &&
    parseFloat(inputAmount || '0') !== 0 &&
    !!bestRoute?.result;

  const needsToWarnEthOnPath = false;

  const buttonTitle =
    accounts.length > 0
      ? hasLimitError
        ? 'Limit Error'
        : loading
        ? 'Finding Best Route...'
        : outToRatioHasWarning
        ? 'Price impact is too high!'
        : priceImpactCanNotBeComputed
        ? 'USD price is unknown, price impact might be high!'
        : needsToWarnEthOnPath
        ? 'The route goes through Ethereum. Continue?'
        : 'Swap'
      : loading
      ? 'Finding Best Route...'
      : outToRatioHasWarning
      ? 'Price impact is too high!'
      : priceImpactCanNotBeComputed
      ? 'USD price is unknown, price impact might be high!'
      : needsToWarnEthOnPath
      ? 'The route goes through Ethereum. Continue?'
      : 'Connect Wallet';

  const buttonDisabled =
    loading ||
    (accounts.length > 0 && hasLimitError) ||
    (accounts.length > 0 && !bestRoute?.result) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (inputUsdValue === null || inputUsdValue.gte(new BigNumber(400)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (inputUsdValue === null || inputUsdValue.gte(new BigNumber(1000)))) ||
    loadingStatus != 'success';

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
      <SwitchButtonContainer>
        <Button variant="ghost" onClick={swithFromAndTo}>
          <VerticalSwapIcon size={36} />
          {isRouterInContext && <SwithFromAndTo count={count} />}
        </Button>
      </SwitchButtonContainer>
      <TokenInfo
        type="To"
        chain={toChain}
        token={toToken}
        outputAmount={outputAmount}
        outputUsdValue={outputUsdValue}
      />
      {showBestRoute && (
        <BestRouteContainer>
          <BestRoute error={bestRouteError} loading={loading} data={data} />
        </BestRouteContainer>
      )}
      {(errorMessage || waningMessage) && (
        <Alerts>
          {errorMessage && <Alert description={errorMessage} type="error" />}
          {waningMessage && <Alert description={waningMessage} type="warning" />}
        </Alerts>
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
              navigate(navigationRoutes.confirmWallets);
            }
          }}>
          {buttonTitle}
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
