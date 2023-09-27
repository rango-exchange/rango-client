import type { SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Alert,
  BestRoute,
  BestRouteSkeleton,
  Button,
  Divider,
  styled,
  SwapInput,
  Typography,
  WarningIcon,
} from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout } from '../components/Layout';
import { NoRoutes } from '../components/NoRoutes';
import { RouteErrors } from '../components/RouteErrors';
import { SwitchFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useSwapInput } from '../hooks/useSwapInput';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { ButtonState } from '../types';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';
import { getFormatedBestRoute } from '../utils/routing';
import {
  canComputePriceImpact,
  getOutputRatio,
  getPercentageChange,
  getSwapButtonState,
  getTotalFeeInUsd,
  hasLimitError,
  LimitErrorMessage,
  outputRatioHasWarning,
} from '../utils/swap';
import { getBalanceFromWallet } from '../utils/wallets';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'visible',
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
  paddingTop: '$2',
});

const FooterStepAlarm = styled('div', {
  paddingBottom: '$15',
});

const FooterAlert = styled('div', {
  width: '100%',
  display: 'flex',
});

const BALANCE_PRECISION = 8;
const TWO_DECIMAL = 2;
const MAX_DECIMAL = 6;
const MIN_DECIMAL = 0;
const WARNING_LEVEL_LIMIT = -10;

export function Home() {
  const navigate = useNavigate();
  const {
    fetch: refetchBestRoute,
    loading: fetchingBestRoute,
    error: bestRouteError,
  } = useSwapInput();
  const {
    fromToken,
    fromBlockchain,
    toToken,
    toBlockchain,
    setInputAmount,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    bestRoute,
    resetRouteWallets,
  } = useBestRouteStore();

  const {
    meta: { tokens },
    loadingStatus: loadingMetaStatus,
  } = useMetaStore();

  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const {
    fromAmountRangeError,
    swap: swapHasError,
    recommendation,
  } = LimitErrorMessage(bestRoute);
  const layoutRef = useRef<HTMLDivElement>(null);

  const showBestRoute =
    !!Number(inputAmount) &&
    (!!bestRoute || fetchingBestRoute || !!bestRouteError);

  const needsToWarnEthOnPath = false;

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);
  const highValueLoss = outputRatioHasWarning(inputUsdValue, outToInRatio);

  const priceImpactInputCanNotBeComputed = !canComputePriceImpact(
    bestRoute,
    inputAmount,
    inputUsdValue
  );

  const priceImpactOutputCanNotBeComputed = !canComputePriceImpact(
    bestRoute,
    inputAmount,
    outputUsdValue
  );
  const swapButtonState = getSwapButtonState(
    loadingMetaStatus,
    connectedWallets,
    fetchingBestRoute,
    bestRoute,
    hasLimitError(bestRoute),
    highValueLoss,
    priceImpactInputCanNotBeComputed || priceImpactOutputCanNotBeComputed,
    needsToWarnEthOnPath,
    inputAmount
  );

  const tokenBalance =
    !!fromBlockchain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromBlockchain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          BALANCE_PRECISION
        )
      : '0';

  const tokenBalanceReal =
    !!fromBlockchain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromBlockchain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          getBalanceFromWallet(
            connectedWallets,
            fromBlockchain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.decimal
        )
      : '0';

  useEffect(() => {
    setCurrentPage(navigationRoutes.home);
    resetRouteWallets();
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
    return swaps.map((swap, index) => ({
      swapper: { displayName: swap.swapperId, image: swap.swapperLogo },
      from: {
        token: { displayName: swap.from.symbol, image: swap.from.logo },
        chain: {
          displayName: swap.from.blockchain,
          image: swap.from.blockchainLogo,
        },
        price: {
          value:
            index === 0
              ? numberToString(inputAmount, MIN_DECIMAL, TWO_DECIMAL)
              : swap.fromAmount,
        },
      },
      to: {
        token: { displayName: swap.to.symbol, image: swap.to.logo },
        chain: {
          displayName: swap.to.blockchain,
          image: swap.to.blockchainLogo,
        },
        price: {
          value: swap.toAmount,
        },
      },
      alerts:
        swap.swapperId === swapHasError?.swapperId ? (
          <FooterStepAlarm>
            <Alert
              type="error"
              title={recommendation}
              footer={
                <FooterAlert>
                  <Typography size="xsmall" variant="body" color="neutral900">
                    {fromAmountRangeError}
                  </Typography>
                  <Divider direction="horizontal" size={8} />
                  <Typography size="xsmall" variant="body" color="neutral900">
                    |
                  </Typography>
                  <Divider direction="horizontal" size={8} />
                  <Typography size="xsmall" variant="body" color="neutral900">
                    {`Yours: ${numberToString(
                      swapHasError?.fromAmount || null
                    )} ${swap?.from.symbol}`}
                  </Typography>
                </FooterAlert>
              }
            />
          </FooterStepAlarm>
        ) : undefined,
    }));
  };

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  const bestRouteData = getFormatedBestRoute(bestRoute);

  return (
    <Layout
      ref={layoutRef}
      fixedHeight={false}
      hasLogo
      footer={
        <Button
          type="primary"
          size="large"
          disabled={swapButtonState.disabled}
          prefix={
            !swapButtonState.disabled &&
            swapButtonState.hasWarning && <WarningIcon />
          }
          fullWidth
          onClick={() => {
            if (swapButtonState.state === ButtonState.WAITFORCONNECTING) {
              navigate(navigationRoutes.wallets);
            } else if (swapButtonState.state === ButtonState.NEEDTOCONFIRM) {
              setOpenWarningModal(true);
            } else {
              navigate(navigationRoutes.confirmSwap);
            }
          }}>
          {swapButtonState.title}
        </Button>
      }
      header={{
        hasConnectWallet: true,
        title: i18n.t('Swap'),
        suffix: (
          <HomeButtons
            layoutRef={layoutRef.current}
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
                displayName: fromBlockchain?.displayName || '',
                image: fromBlockchain?.logo || '',
              }}
              token={{
                displayName: fromToken?.symbol || '',
                image: fromToken?.image || '',
              }}
              onClickToken={() => navigate('from-swap')}
              price={{
                value: inputAmount,
                usdValue: priceImpactInputCanNotBeComputed
                  ? undefined
                  : numberToString(inputUsdValue),
                error: priceImpactInputCanNotBeComputed
                  ? errorMessages.unknownPriceError.impacTitle
                  : undefined,
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
            sharpBottomStyle={!!bestRoute?.result || fetchingBestRoute}
            label="To"
            chain={{
              displayName: toBlockchain?.displayName || '',
              image: toBlockchain?.logo || '',
            }}
            token={{
              displayName: toToken?.symbol || '',
              image: toToken?.image || '',
            }}
            percentageChange={
              !!percentageChange?.lt(0)
                ? numberToString(percentageChange, MIN_DECIMAL, TWO_DECIMAL)
                : null
            }
            warningLevel={
              !!percentageChange?.lt(WARNING_LEVEL_LIMIT) ? 'high' : 'low'
            }
            price={{
              value: numberToString(outputAmount),
              usdValue: priceImpactOutputCanNotBeComputed
                ? undefined
                : numberToString(outputUsdValue),
              error: priceImpactOutputCanNotBeComputed
                ? errorMessages.unknownPriceError.impacTitle
                : undefined,
            }}
            onClickToken={() => navigate('to-swap')}
            disabled={loadingMetaStatus === 'failed'}
            loading={loadingMetaStatus === 'loading'}
          />
        </InputsContainer>
        {fetchingBestRoute && (
          <BestRouteContainer>
            <BestRouteSkeleton type="basic" />
          </BestRouteContainer>
        )}
        {showBestRoute &&
        !fetchingBestRoute &&
        bestRouteData?.result?.swaps?.length ? (
          <BestRouteContainer>
            <BestRoute
              type="basic"
              recommended={true}
              input={{
                value: numberToString(inputAmount, MIN_DECIMAL, MAX_DECIMAL),
                usdValue: numberToString(inputUsdValue),
              }}
              output={{
                value: numberToString(outputAmount),
                usdValue: numberToString(outputUsdValue),
              }}
              steps={getBestRouteSteps(bestRouteData.result.swaps)}
              percentageChange={numberToString(
                percentageChange,
                MIN_DECIMAL,
                TWO_DECIMAL
              )}
              totalFee={numberToString(totalFeeInUsd, MIN_DECIMAL, TWO_DECIMAL)}
              totalTime={secondsToString(totalArrivalTime(bestRoute))}
            />
          </BestRouteContainer>
        ) : showBestRoute && !fetchingBestRoute ? (
          <>
            <Divider size={20} />
            <NoRoutes
              diagnosisMessage={bestRouteData?.diagnosisMessages?.[0]}
              fetch={refetchBestRoute}
              error={!!bestRouteError}
            />
          </>
        ) : null}
      </Container>
      {!fetchingBestRoute && (
        <RouteErrors
          openModal={openWarningModal}
          onToggle={setOpenWarningModal}
          totalFeeInUsd={totalFeeInUsd}
          outputUsdValue={outputUsdValue}
          inputUsdValue={inputUsdValue}
          percentageChange={percentageChange}
          highValueLoss={highValueLoss}
          priceImpactCanNotBeComputed={
            priceImpactInputCanNotBeComputed ||
            priceImpactOutputCanNotBeComputed
          }
        />
      )}
    </Layout>
  );
}
