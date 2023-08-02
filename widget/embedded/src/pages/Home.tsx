import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePanel } from '@rango-dev/ui';
import { fetchBestRoute, useBestRouteStore } from '../store/bestRoute';
import { SwithFromAndToButton } from '../components/SwitchFromAndTo';
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
  getPercentageChange,
} from '../utils/swap';
import { useUiStore } from '../store/ui';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';
import { getBalanceFromWallet } from '../utils/wallets';
import { getFormatedBestRoute } from '../utils/routing';
import BigNumber from 'bignumber.js';

export function Home() {
  const navigate = useNavigate();
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

  const errorMessage =
    loadingMetaStatus === 'failed'
      ? errorMessages.genericServerError
      : bestRouteError;

  const needsToWarnEthOnPath = false;

  const showBestRoute =
    !!inputAmount && (!!bestRoute || fetchingBestRoute || !!bestRouteError);

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

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          8
        )
      : '0';

  const tokenBalanceReal =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.decimal
        )
      : '0';

  useEffect(() => {
    setCurrentPage(navigationRoutes.home);

    return setCurrentPage.bind(null, '');
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPercentageChange(
          inputUsdValue.toNumber(),
          outputUsdValue.toNumber()
        );

  return (
    <HomePanel
      bestRoute={bestRoute}
      bestRouteError={bestRouteError}
      fetchBestRoute={fetchBestRoute}
      onClickHistory={() => navigate(navigationRoutes.swaps)}
      onClickSettings={() => navigate(navigationRoutes.settings)}
      setInputAmount={setInputAmount}
      fromChain={fromChain}
      toChain={toChain}
      fromToken={fromToken}
      toToken={toToken}
      outputAmount={
        outputAmount
          ? numberToString(new BigNumber(outputAmount))
          : numberToString(new BigNumber(0))
      }
      inputAmount={inputAmount}
      loadingStatus={loadingMetaStatus}
      showBestRoute={showBestRoute}
      fetchingBestRoute={fetchingBestRoute}
      outputUsdValue={numberToString(outputUsdValue)}
      inputUsdValue={numberToString(inputUsdValue)}
      swapButtonTitle={swapButtonState.title}
      swapButtonDisabled={swapButtonState.disabled}
      swapButtonClick={() => {
        if (swapButtonState.title === 'Connect Wallet')
          navigate(navigationRoutes.wallets);
        else {
          navigate(navigationRoutes.confirmSwap, { replace: true });
        }
      }}
      onChainClick={(route) => {
        navigate(route);
      }}
      onTokenClick={(route) => {
        navigate(route);
      }}
      highFee={highFee}
      errorMessage={errorMessage}
      hasLimitError={hasLimitError}
      swap={swap}
      fromAmountRangeError={fromAmountRangeError}
      recommendation={recommendation}
      totalFeeInUsd={numberToString(totalFeeInUsd, 0, 2)}
      swithFromAndToComponent={<SwithFromAndToButton />}
      connectedWallets={connectedWallets}
      percentageChange={numberToString(percentageChange, 0, 2)}
      showPercentageChange={!!percentageChange?.lt(0)}
      tokenBalanceReal={tokenBalanceReal}
      tokenBalance={tokenBalance}
      totalTime={secondsToString(totalArrivalTime(bestRoute))}
      bestRouteData={getFormatedBestRoute(bestRoute)}
      swapFromAmount={numberToString(swap?.fromAmount || null)}
    />
  );
}
