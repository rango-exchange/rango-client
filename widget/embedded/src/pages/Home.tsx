import {
  Alert,
  BestRoute,
  Button,
  styled,
  Typography,
  VerticalSwapIcon,
  Header,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
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
import BigNumber from 'bignumber.js';
import { HeaderButtons } from '../components/HeaderButtons';
import { useUiStore } from '../store/ui';
import { getFormatedBestRoute } from '../utils/routing';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const FromContainer = styled('div', {
  position: 'relative',
  paddingBottom: '$12',
});

const SwitchButtonContainer = styled('div', {
  position: 'absolute',
  bottom: '-12px',
  left: '50%',
  transform: 'translate(-50%, 10%)',
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
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const fromChain = useBestRouteStore.use.fromChain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toChain = useBestRouteStore.use.toChain();
  const toToken = useBestRouteStore.use.toToken();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const outputAmount = useBestRouteStore.use.outputAmount();
  const outputUsdValue = useBestRouteStore.use.outputUsdValue();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const tokens = useMetaStore.use.meta().tokens;
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const bestRouteError = useBestRouteStore.use.error();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();
  const switchFromAndTo = useBestRouteStore.use.switchFromAndTo();

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
    connectedWallets,
    fetchingBestRoute,
    bestRoute,
    hasLimitError(bestRoute),
    highValueLoss,
    priceImpactCanNotBeComputed,
    needsToWarnEthOnPath,
    inputAmount
  );

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  const highFee = hasHighFee(totalFeeInUsd);

  useEffect(() => {
    setCurrentPage(navigationRoutes.home);

    return setCurrentPage.bind(null, '');
  }, []);

  return (
    <Container>
      <Header
        title="SWAP"
        suffix={
          <HeaderButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? fetchBestRoute : undefined
            }
          />
        }
      />
      <FromContainer>
        <TokenInfo
          type="From"
          chain={fromChain}
          token={fromToken}
          onAmountChange={setInputAmount}
          inputAmount={inputAmount}
        />
        <SwitchButtonContainer>
          <Button
            variant="ghost"
            onClick={() => {
              switchFromAndTo();
              setCount((prev) => prev + 1);
            }}
          >
            <VerticalSwapIcon size={32} />
            {isRouterInContext && <SwithFromAndTo count={count} />}
          </Button>
        </SwitchButtonContainer>
      </FromContainer>
      <TokenInfo
        type="To"
        chain={toChain}
        token={toToken}
        outputAmount={
          outputAmount ? new BigNumber(outputAmount) : new BigNumber(0)
        }
        outputUsdValue={outputUsdValue}
      />
      {showBestRoute && (
        <BestRouteContainer>
          <BestRoute
            error={bestRouteError}
            loading={fetchingBestRoute}
            data={getFormatedBestRoute(bestRoute)}
            totalFee={numberToString(totalFeeInUsd, 0, 2)}
            feeWarning={highFee}
            totalTime={secondsToString(totalArrivalTime(bestRoute))}
          />
        </BestRouteContainer>
      )}
      {(errorMessage || hasLimitError(bestRoute)) && (
        <Alerts>
          {errorMessage && <Alert type="error">{errorMessage}</Alert>}
          {hasLimitError(bestRoute) && (
            <Alert type="error" title={`${swap?.swapperId} Limit`}>
              <>
                <Typography variant="body2">
                  {`${fromAmountRangeError}, Yours: ${numberToString(
                    swap?.fromAmount || null
                  )} ${swap?.from.symbol}`}
                </Typography>
                <Typography variant="body2">{recommendation}</Typography>
              </>
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
              navigate(navigationRoutes.confirmSwap, { replace: true });
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
