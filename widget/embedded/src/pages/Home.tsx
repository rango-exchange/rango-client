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
import { useMetaStore } from '../store/meta';
import { useWalletsStore } from '../store/wallets';
import { BestRouteType } from '@rangodev/ui/dist/types/swaps';
import { errorMessages } from '../constants/errors';
import {
  getSwapButtonTitle,
  getOutputRatio,
  hasLimitError,
  outputRatioHasWarning,
  canComputePriceImpact,
} from '../utils/swap';

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

  const { loadingStatus: loadingMetaStatus } = useMetaStore();
  const { accounts } = useWalletsStore();

  const swithFromAndTo = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(fromChain);
    setToToken(fromToken);
    setInputAmount(outputAmount?.toString() || '');
    setCount((prev) => prev + 1);
  };

  const { data, loading: fetchingBestRoute, error: bestRouteError, retry } = useBestRoute();

  const noConnectedWallet = accounts.length > 0;

  const noRoutesFound = !bestRoute?.result;

  const errorMessage =
    loadingMetaStatus === 'failed' ? errorMessages.genericServerError : bestRouteError;

  const needsToWarnEthOnPath = false;

  const showBestRoute = inputAmount && (!!data || fetchingBestRoute || bestRouteError);

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);

  const highValueLoss = outputRatioHasWarning(inputUsdValue, outToInRatio);

  const priceImpactCanNotBeComputed = !canComputePriceImpact(
    //@ts-ignore
    bestRoute,
    inputAmount,
    inputUsdValue,
    outputUsdValue,
  );

  const buttonTitle = getSwapButtonTitle(
    accounts,
    fetchingBestRoute,
    //@ts-ignore
    hasLimitError(bestRoute),
    highValueLoss,
    priceImpactCanNotBeComputed,
    needsToWarnEthOnPath,
  );

  const buttonDisabled =
    loadingMetaStatus != 'success' ||
    fetchingBestRoute ||
    highValueLoss ||
    (noConnectedWallet && noRoutesFound) ||
    //@ts-ignore
    hasLimitError(bestRoute);

  useEffect(() => {
    setBestRoute(data as BestRouteType);
  }, [data]);

  return (
    <Container>
      <Header onClickRefresh={retry} />
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
          <BestRoute error={bestRouteError} loading={fetchingBestRoute} data={data} />
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
