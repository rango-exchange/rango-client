import { i18n } from '@lingui/core';
import { Button, styled, SwapInput, WarningIcon } from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout } from '../components/Layout';
import { SwitchFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import {
  BALANCE_MAX_DECIMALS,
  BALANCE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../constants/routing';
import { QuoteInfo } from '../containers/QuoteInfo';
import { useSwapInput } from '../hooks/useSwapInput';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { ButtonState } from '../types';
import { numberToString } from '../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../utils/quote';
import {
  canComputePriceImpact,
  getOutputRatio,
  getPercentageChange,
  getSwapButtonState,
  hasHighValueLoss,
  hasLimitError,
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
export function Home() {
  const navigate = useNavigate();
  const {
    fetch: fetchQuote,
    loading: fetchingQuote,
    error: quoteError,
    warning: quoteWarning,
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
    quote,
    resetQuoteWallets,
    setQuoteWarningsConfirmed,
  } = useQuoteStore();

  const loadingMetaStatus = useAppStore().use.loadingStatus();

  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  const needsToWarnEthOnPath = false;

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);
  const highValueLoss = hasHighValueLoss(inputUsdValue, outToInRatio);

  const priceImpactInputCanNotBeComputed = !canComputePriceImpact(
    quote,
    inputAmount,
    inputUsdValue
  );

  const priceImpactOutputCanNotBeComputed = !canComputePriceImpact(
    quote,
    inputAmount,
    outputUsdValue
  );
  const swapButtonState = getSwapButtonState(
    loadingMetaStatus,
    connectedWallets,
    fetchingQuote,
    quote,
    hasLimitError(quote),
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
    resetQuoteWallets();
    return setCurrentPage.bind(null, '');
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPercentageChange(
          inputUsdValue.toString(),
          outputUsdValue.toString()
        );
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
            } else if (quoteWarning) {
              setShowQuoteWarningModal(true);
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
            onClickRefresh={!!quote || quoteError ? fetchQuote : undefined}
            onClickHistory={() => navigate(navigationRoutes.swaps)}
            onClickSettings={() => navigate(navigationRoutes.settings)}
          />
        ),
      }}>
      <Container>
        <InputsContainer>
          <FromContainer>
            <SwapInput
              label={i18n.t('From')}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              mode="From"
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
                  ? errorMessages().unknownPriceError.impactTitle
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
            sharpBottomStyle={!!quote?.result || fetchingQuote}
            label={i18n.t('To')}
            mode="To"
            chain={{
              displayName: toBlockchain?.displayName || '',
              image: toBlockchain?.logo || '',
            }}
            token={{
              displayName: toToken?.symbol || '',
              image: toToken?.image || '',
            }}
            percentageChange={numberToString(
              getPriceImpact(inputUsdValue, outputUsdValue),
              PERCENTAGE_CHANGE_MIN_DECIMALS,
              PERCENTAGE_CHANGE_MAX_DECIMALS
            )}
            warningLevel={getPriceImpactLevel(percentageChange ?? 0)}
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
                ? errorMessages().unknownPriceError.impactTitle
                : undefined,
            }}
            onClickToken={() => navigate('to-swap')}
            disabled={loadingMetaStatus === 'failed'}
            loading={loadingMetaStatus === 'loading'}
          />
        </InputsContainer>
        <QuoteInfo
          quote={quote}
          loading={fetchingQuote}
          error={quoteError}
          warning={quoteWarning}
          type="basic"
          refetchQuote={fetchQuote}
          showWarningModal={showQuoteWarningModal}
          onOpenWarningModal={() => setShowQuoteWarningModal(true)}
          onCloseWarningModal={() => setShowQuoteWarningModal(false)}
          onConfirmWarningModal={() => {
            setShowQuoteWarningModal(false);
            setQuoteWarningsConfirmed(true);
            navigate(navigationRoutes.confirmSwap);
          }}
        />
      </Container>
    </Layout>
  );
}
