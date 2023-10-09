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
import {
  BALANCE_MAX_DECIMALS,
  BALANCE_MIN_DECIMALS,
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../constants/routing';
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
import { getFormattedBestRoute, getPriceImpactLevel } from '../utils/routing';
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
          BALANCE_MIN_DECIMALS,
          BALANCE_MAX_DECIMALS
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
              ? numberToString(
                  inputAmount,
                  TOKEN_AMOUNT_MIN_DECIMALS,
                  TOKEN_AMOUNT_MAX_DECIMALS
                )
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
                      swapHasError?.fromAmount || null,
                      TOKEN_AMOUNT_MIN_DECIMALS,
                      TOKEN_AMOUNT_MAX_DECIMALS
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

  const bestRouteData = getFormattedBestRoute(bestRoute);

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
                  : numberToString(
                      inputUsdValue,
                      USD_VALUE_MIN_DECIMALS,
                      USD_VALUE_MAX_DECIMALS
                    ),
                error: priceImpactInputCanNotBeComputed
                  ? errorMessages.unknownPriceError.impactTitle
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
                ? numberToString(
                    percentageChange,
                    PERCENTAGE_CHANGE_MIN_DECIMALS,
                    PERCENTAGE_CHANGE_MAX_DECIMALS
                  )
                : null
            }
            warningLevel={getPriceImpactLevel(
              percentageChange?.toNumber() ?? 0
            )}
            price={{
              value: numberToString(
                outputAmount,
                TOKEN_AMOUNT_MIN_DECIMALS,
                TOKEN_AMOUNT_MAX_DECIMALS
              ),
              usdValue: priceImpactOutputCanNotBeComputed
                ? undefined
                : numberToString(
                    outputUsdValue,
                    USD_VALUE_MIN_DECIMALS,
                    USD_VALUE_MAX_DECIMALS
                  ),
              error: priceImpactOutputCanNotBeComputed
                ? errorMessages.unknownPriceError.impactTitle
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
                value: numberToString(
                  inputAmount,
                  TOKEN_AMOUNT_MIN_DECIMALS,
                  TOKEN_AMOUNT_MAX_DECIMALS
                ),
                usdValue: numberToString(
                  inputUsdValue,
                  USD_VALUE_MIN_DECIMALS,
                  USD_VALUE_MAX_DECIMALS
                ),
              }}
              output={{
                value: numberToString(
                  outputAmount,
                  TOKEN_AMOUNT_MIN_DECIMALS,
                  TOKEN_AMOUNT_MAX_DECIMALS
                ),
                usdValue: numberToString(
                  outputUsdValue,
                  USD_VALUE_MIN_DECIMALS,
                  USD_VALUE_MAX_DECIMALS
                ),
              }}
              steps={getBestRouteSteps(bestRouteData.result.swaps)}
              percentageChange={numberToString(
                percentageChange,
                PERCENTAGE_CHANGE_MIN_DECIMALS,
                PERCENTAGE_CHANGE_MAX_DECIMALS
              )}
              totalFee={numberToString(
                totalFeeInUsd,
                GAS_FEE_MIN_DECIMALS,
                GAS_FEE_MAX_DECIMALS
              )}
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
      <RouteErrors
        openModal={openWarningModal}
        onToggle={setOpenWarningModal}
        totalFeeInUsd={totalFeeInUsd}
        outputUsdValue={outputUsdValue}
        inputUsdValue={inputUsdValue}
        percentageChange={percentageChange}
        highValueLoss={highValueLoss}
        priceImpactCanNotBeComputed={
          priceImpactInputCanNotBeComputed || priceImpactOutputCanNotBeComputed
        }
        loading={fetchingBestRoute || loadingMetaStatus === 'loading'}
        extraSpace={!!bestRoute?.result || !bestRoute}
      />
    </Layout>
  );
}
