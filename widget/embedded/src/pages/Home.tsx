import { i18n } from '@lingui/core';
import { Alert, Button, styled, TokenInfo, Typography } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout } from '../components/Layout';
import { SwithFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { fetchBestRoute, useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { numberToString } from '../utils/numbers';
import {
  canComputePriceImpact,
  getOutputRatio,
  getPercentageChange,
  getSwapButtonState,
  hasLimitError,
  LimitErrorMessage,
  outputRatioHasWarning,
} from '../utils/swap';
import { getBalanceFromWallet } from '../utils/wallets';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const FromContainer = styled('div', {
  position: 'relative',
});

const BestRouteContainer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});
const Alerts = styled('div', {
  width: '100%',
  paddingTop: '$16',
});
const Footer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});

const balancePercision = 8;

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
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const bestRouteError = useBestRouteStore.use.error();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();
  const errorMessage =
    loadingMetaStatus === 'failed'
      ? errorMessages.genericServerError
      : bestRouteError;

  const showBestRoute =
    !!inputAmount && (!!bestRoute || fetchingBestRoute || !!bestRouteError);

  const { fromAmountRangeError, recommendation, swap } =
    LimitErrorMessage(bestRoute);

  const needsToWarnEthOnPath = false;

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);
  const highValueLoss = outputRatioHasWarning(inputUsdValue, outToInRatio);

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

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          balancePercision
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
    <Layout
      hasFooter
      header={{
        hasConnectWallet: true,
        title: i18n.t('Swap'),
        suffix: (
          <HomeButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? fetchBestRoute : undefined
            }
            onClickHistory={() => navigate(navigationRoutes.swaps)}
            onClickSettings={() => navigate(navigationRoutes.settings)}
          />
        ),
      }}>
      <Container>
        <FromContainer>
          <TokenInfo
            type="From"
            chain={fromChain}
            token={fromToken}
            onAmountChange={setInputAmount}
            inputAmount={inputAmount}
            fromChain={fromChain}
            toChain={toChain}
            loadingStatus={loadingMetaStatus}
            inputUsdValue={numberToString(inputUsdValue)}
            fromToken={fromToken}
            setInputAmount={setInputAmount}
            connectedWallets={connectedWallets}
            bestRoute={bestRoute}
            fetchingBestRoute={fetchingBestRoute}
            onChainClick={() => navigate('from-chain')}
            onTokenClick={() => navigate('from-token')}
            tokenBalanceReal={tokenBalanceReal}
            tokenBalance={tokenBalance}
          />
          <SwithFromAndToButton />
        </FromContainer>
        <TokenInfo
          type="To"
          chain={toChain}
          token={toToken}
          outputAmount={numberToString(outputAmount)}
          percentageChange={numberToString(percentageChange)}
          outputUsdValue={numberToString(outputUsdValue)}
          fromChain={fromChain}
          toChain={toChain}
          loadingStatus={loadingMetaStatus}
          inputUsdValue={numberToString(inputUsdValue)}
          fromToken={fromToken}
          setInputAmount={setInputAmount}
          connectedWallets={connectedWallets}
          inputAmount={inputAmount}
          bestRoute={bestRoute}
          fetchingBestRoute={fetchingBestRoute}
          onChainClick={() => navigate('to-chain')}
          onTokenClick={() => navigate('to-token')}
          tokenBalanceReal={tokenBalanceReal}
          tokenBalance={tokenBalance}
          showPercentageChange={!!percentageChange?.lt(0)}
        />
        {showBestRoute && <BestRouteContainer></BestRouteContainer>}
        {(errorMessage || hasLimitError(bestRoute)) && (
          <Alerts>
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {hasLimitError(bestRoute) && (
              <Alert type="error" title={`${swap?.swapperId} Limit`}>
                <>
                  <Typography variant="body" size="small">
                    {`${fromAmountRangeError}, Yours: ${numberToString(
                      swap?.fromAmount || null
                    )} ${swap?.from.symbol}`}
                  </Typography>
                  <Typography variant="body" size="small">
                    {recommendation}
                  </Typography>
                </>
              </Alert>
            )}
          </Alerts>
        )}
        <Footer>
          <Button
            type="primary"
            size="large"
            disabled={swapButtonState.disabled}
            onClick={() => {
              if (swapButtonState.title === 'Connect Wallet') {
                navigate(navigationRoutes.wallets);
              } else {
                navigate(navigationRoutes.confirmSwap, { replace: true });
              }
            }}>
            {swapButtonState.title}
          </Button>
        </Footer>
      </Container>
    </Layout>
  );
}
