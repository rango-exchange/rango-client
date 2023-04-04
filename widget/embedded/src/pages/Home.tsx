import {
  Alert,
  BestRoute,
  Button,
  styled,
  Typography,
  VerticalSwapIcon,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TokenInfo } from '../components/TokenInfo';
import { fetchBestRoute, useBestRouteStore } from '../store/bestRoute';
import { BottomLogo } from '../components/BottomLogo';
import { SwithFromAndTo } from '../components/SwitchFromAndTo';
import { Footer } from '../components/Footer';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useMetaStore } from '../store/meta';
import { useWalletsStore } from '../store/wallets';
import { errorMessages } from '../constants/errors';
import {
  getSwapButtonState,
  getOutputRatio,
  hasLimitError,
  outputRatioHasWarning,
  canComputePriceImpact,
  LimitErrorMessage,
  getTotalFeeInUsd,
  hasHighFee,
} from '../utils/swap';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';

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
  width: '100%',
  paddingTop: '$16',
});

export function Home() {
  const waningMessage = '';
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const fromChain = useBestRouteStore.use.fromChain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toChain = useBestRouteStore.use.toChain();
  const toToken = useBestRouteStore.use.toToken();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToChain = useBestRouteStore.use.setToChain();
  const setToToken = useBestRouteStore.use.setToToken();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const outputAmount = useBestRouteStore.use.outputAmount();
  const outputUsdValue = useBestRouteStore.use.outputUsdValue();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const tokens = useMetaStore.use.meta().tokens;
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const bestRouteError = useBestRouteStore.use.error();

  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const accounts = useWalletsStore.use.accounts();

  const swithFromAndTo = () => {
    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(fromChain);
    setToToken(fromToken);
    setInputAmount(outputAmount?.toString() || '');
    setCount((prev) => prev + 1);
  };

  const errorMessage =
    loadingMetaStatus === 'failed'
      ? errorMessages.genericServerError
      : bestRouteError;

  const needsToWarnEthOnPath = false;

  const showBestRoute =
    inputAmount && (!!bestRoute || fetchingBestRoute || bestRouteError);

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);

  const highValueLoss = outputRatioHasWarning(inputUsdValue, outToInRatio);

  const { fromAmountRangeError, recommendation, swap } =
    LimitErrorMessage(bestRoute);

  const priceImpactCanNotBeComputed = !canComputePriceImpact(
    bestRoute,
    inputAmount,
    inputUsdValue,
    outputUsdValue
  );

  const swapButtonState = getSwapButtonState(
    loadingMetaStatus,
    accounts,
    fetchingBestRoute,
    bestRoute,
    hasLimitError(bestRoute),
    highValueLoss,
    priceImpactCanNotBeComputed,
    needsToWarnEthOnPath
  );

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  const highFee = hasHighFee(totalFeeInUsd);

  return (
    <Container>
      <Header onClickRefresh={fetchBestRoute} />
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
          <BestRoute
            error={bestRouteError}
            loading={fetchingBestRoute}
            data={bestRoute}
            totalFee={numberToString(totalFeeInUsd, 0, 2)}
            feeWarning={highFee}
            totalTime={secondsToString(totalArrivalTime(bestRoute))}
          />
        </BestRouteContainer>
      )}
      {(errorMessage || waningMessage || hasLimitError(bestRoute)) && (
        <Alerts>
          {errorMessage && (
            <Alert type="error">
              {<Typography variant="body2">{errorMessage}</Typography>}
            </Alert>
          )}
          {hasLimitError(bestRoute) && (
            <Alert type="error" title={`${swap?.swapperId} Limit`}>
              <>
                <Typography variant="body2">{fromAmountRangeError}</Typography>
                <br />
                <Typography variant="body2">
                  Yours: {numberToString(swap?.fromAmount || null)}
                  {swap?.from.symbol}
                </Typography>
                <br />
                <Typography variant="body2">{recommendation}</Typography>
              </>
            </Alert>
          )}
          {waningMessage && (
            <Alert type="warning">
              <Typography variant="body2">{waningMessage}</Typography>
            </Alert>
          )}
        </Alerts>
      )}
      <Footer>
        <Button
          type="primary"
          align="grow"
          size="large"
          disabled={swapButtonState.disabled}
          onClick={() => {
            if (swapButtonState.title === 'Connect Wallet')
              navigate(navigationRoutes.wallets);
            else {
              navigate(navigationRoutes.confirmWallets, { replace: true });
            }
          }}
        >
          {swapButtonState.title}
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
