import type { SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Alert,
  BestRoute,
  Button,
  styled,
  SwapInput,
  Typography,
} from '@rango-dev/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout } from '../components/Layout';
import { SwitchFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useSwapInput } from '../hooks/useSwapInput';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';
import {
  canComputePriceImpact,
  getOutputRatio,
  getPercentageChange,
  getSwapButtonState,
  getTotalFeeInUsd,
  hasHighFee,
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

const InputsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  alignSelf: 'stretch',
});

const BestRouteContainer = styled('div', {
  width: '100%',
  paddingTop: '$16',
  marginBottom: '-36px',
});
const Alerts = styled('div', {
  width: '100%',
  paddingTop: '$16',
});
const Footer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});

const BALANCE_PRECISION = 8;
const MAX_DECIMAL = 2;
const MIN_DECIMAL = 0;

export function Home() {
  const navigate = useNavigate();
  const {
    fetch: refetchBestRoute,
    loading: fetchingBestRoute,
    error: bestRouteError,
  } = useSwapInput();
  const {
    fromToken,
    fromChain,
    toToken,
    toChain,
    setInputAmount,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    bestRoute,
    setRouteWalletConfirmed,
  } = useBestRouteStore();

  const {
    meta: { tokens },
    loadingStatus: loadingMetaStatus,
  } = useMetaStore();

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
          BALANCE_PRECISION
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
    setRouteWalletConfirmed(false);
    return setCurrentPage.bind(null, '');
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPercentageChange(
          inputUsdValue.toNumber(),
          outputUsdValue.toNumber()
        );

  const getBestRouteSteps = (swaps: SwapResult[]) => {
    return swaps.map((swap) => ({
      swapper: { displayName: swap.swapperId, image: swap.swapperLogo },
      from: {
        token: { displayName: swap.from.symbol, image: swap.from.logo },
        chain: {
          displayName: swap.from.blockchain,
          image: swap.from.blockchainLogo,
        },
        price: { value: inputAmount },
      },
      to: {
        token: { displayName: swap.to.symbol, image: swap.to.logo },
        chain: {
          displayName: swap.to.blockchain,
          image: swap.to.blockchainLogo,
        },
        price: {
          value: outputAmount
            ? numberToString(new BigNumber(outputAmount))
            : numberToString(new BigNumber(0)),
        },
      },
    }));
  };

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);
  const highFee = hasHighFee(totalFeeInUsd);

  return (
    <Layout
      hasFooter
      header={{
        hasConnectWallet: true,
        title: i18n.t('Swap'),
        suffix: (
          <HomeButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? refetchBestRoute : undefined
            }
            onClickHistory={() => navigate(navigationRoutes.swaps)}
            onClickSettings={() => navigate(navigationRoutes.settings)}
          />
        ),
      }}>
      <Container>
        <InputsContainer>
          <FromContainer>
            <SwapInput
              label="From"
              onInputChange={setInputAmount}
              balance={tokenBalance}
              chain={{
                displayName: fromChain?.displayName || '',
                image: fromChain?.logo || '',
              }}
              token={{
                displayName: fromToken?.symbol || '',
                image: fromToken?.image || '',
              }}
              onClickToken={() => navigate('from-swap')}
              price={{
                value: inputAmount,
                usdValue: numberToString(inputUsdValue),
              }}
              disabled={loadingMetaStatus === 'failed'}
              loading={loadingMetaStatus === 'loading'}
              onSelectMaxBalance={() => {
                if (tokenBalance !== '0') {
                  setInputAmount(tokenBalanceReal.split(',').join(''));
                }
              }}
            />
            <SwitchFromAndToButton />
          </FromContainer>
          <SwapInput
            label="To"
            chain={{
              displayName: toChain?.displayName || '',
              image: toChain?.logo || '',
            }}
            token={{
              displayName: toToken?.symbol || '',
              image: toToken?.image || '',
            }}
            percentageChange={
              !!percentageChange?.lt(0)
                ? numberToString(percentageChange, MIN_DECIMAL, MAX_DECIMAL)
                : null
            }
            warningLevel={highFee ? 'high' : 'low'}
            price={{
              value: numberToString(outputAmount),
              usdValue: numberToString(outputUsdValue),
            }}
            onClickToken={() => navigate('to-swap')}
            disabled={loadingMetaStatus === 'failed'}
            loading={loadingMetaStatus === 'loading'}
          />
        </InputsContainer>
        {showBestRoute && bestRoute?.result?.swaps?.length ? (
          <BestRouteContainer>
            <BestRoute
              type="basic"
              recommended={true}
              input={{
                value: inputAmount,
                usdValue: numberToString(inputUsdValue),
              }}
              output={{
                value: numberToString(outputAmount),
                usdValue: numberToString(outputUsdValue),
              }}
              steps={getBestRouteSteps(bestRoute.result.swaps)}
              percentageChange={numberToString(
                percentageChange,
                MIN_DECIMAL,
                MAX_DECIMAL
              )}
              totalFee={numberToString(totalFeeInUsd, MIN_DECIMAL, MAX_DECIMAL)}
              totalTime={secondsToString(totalArrivalTime(bestRoute))}
            />
          </BestRouteContainer>
        ) : null}

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
            fullWidth
            loading={loadingMetaStatus === 'loading'}
            onClick={() => {
              if (swapButtonState.title === 'Connect Wallet') {
                navigate(navigationRoutes.wallets);
              } else {
                navigate(navigationRoutes.confirmSwap);
              }
            }}>
            {swapButtonState.title}
          </Button>
        </Footer>
      </Container>
    </Layout>
  );
}
