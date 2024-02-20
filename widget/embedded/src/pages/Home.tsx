import { i18n } from '@lingui/core';
import { Button, Divider, styled, SwapInput, WarningIcon } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteWarningsAndErrors } from '../components/QuoteWarningsAndErrors';
import { SwitchFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import {
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
import { getContainer } from '../utils/common';
import { formatTooltipNumbers, numberToString } from '../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../utils/quote';
import { canComputePriceImpact, getSwapButtonState } from '../utils/swap';
import { formatBalance, isFetchingBalance } from '../utils/wallets';

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
    fromToken,
    fromBlockchain,
    toToken,
    toBlockchain,
    setInputAmount,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    selectedQuote,
    refetchQuote,
    error: quoteError,
    warning: quoteWarning,
    quotes,
    resetQuoteWallets,
    setQuoteWarningsConfirmed,
    updateQuotePartialState,
  } = useQuoteStore();
  const { fetch: fetchQuote, loading } = useSwapInput({ refetchQuote });

  const { config, fetchStatus: fetchMetaStatus } = useAppStore();

  const { connectedWallets, getBalanceFor } = useWalletsStore();
  const { isActiveTab } = useUiStore();
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);
  const fetchingBalance =
    !!fromBlockchain &&
    isFetchingBalance(connectedWallets, fromBlockchain.name);

  const needsToWarnEthOnPath = false;

  const priceImpactInputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    inputUsdValue
  );

  const priceImpactOutputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    outputUsdValue
  );

  const swapButtonState = getSwapButtonState({
    fetchMetaStatus,
    fetchingQuote: loading,
    inputAmount,
    quote: selectedQuote,
    anyWalletConnected: connectedWallets.length > 0,
    error: quoteError,
    warning: quoteWarning,
    needsToWarnEthOnPath,
  });

  const fromTokenBalance = fromToken ? getBalanceFor(fromToken) : null;

  const fromTokenFormattedBalance =
    formatBalance(fromTokenBalance)?.amount ?? '0';

  const tokenBalanceReal =
    !!fromBlockchain && !!fromToken && fromTokenBalance?.amount
      ? numberToString(fromTokenBalance?.amount, fromTokenBalance?.decimals)
      : '0';

  const fetchingQuote =
    fetchMetaStatus === 'success' &&
    !!inputAmount &&
    !!fromToken &&
    !!toToken &&
    loading;

  useEffect(() => {
    resetQuoteWallets();
    updateQuotePartialState('refetchQuote', true);
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPriceImpact(inputUsdValue.toString(), outputUsdValue.toString());

  return (
    <Layout
      height="auto"
      footer={
        <Button
          type="primary"
          size="large"
          disabled={swapButtonState.disabled || !isActiveTab}
          prefix={
            swapButtonState.action === 'confirm-warning' && <WarningIcon />
          }
          fullWidth
          onClick={() => {
            if (swapButtonState.action === 'connect-wallet') {
              navigate(navigationRoutes.wallets);
            } else if (swapButtonState.action === 'confirm-warning') {
              setShowQuoteWarningModal(true);
            } else {
              navigate(navigationRoutes.confirmSwap);
            }
          }}>
          {swapButtonState.title}
        </Button>
      }
      header={{
        onWallet: () => {
          navigate(navigationRoutes.wallets);
        },
        hasBackButton: false,
        title: config.title || i18n.t('Swap'),
        suffix: (
          <HeaderButtons
            onClickRefresh={
              (!!selectedQuote || quoteError) && !showQuoteWarningModal
                ? fetchQuote
                : undefined
            }
            onClickHistory={() => navigate(navigationRoutes.swaps)}
            onClickSettings={() => navigate(navigationRoutes.settings)}
          />
        ),
      }}>
      <PageContainer>
        <InputsContainer>
          <FromContainer>
            <SwapInput
              label={i18n.t('From')}
              mode="From"
              onInputChange={setInputAmount}
              balance={fromTokenFormattedBalance}
              chain={{
                displayName: fromBlockchain?.displayName || '',
                image: fromBlockchain?.logo || '',
              }}
              token={{
                displayName: fromToken?.symbol || '',
                image: fromToken?.image || '',
              }}
              onClickToken={() => navigate(navigationRoutes.fromSwap)}
              price={{
                value: inputAmount,
                usdValue: priceImpactInputCanNotBeComputed
                  ? undefined
                  : numberToString(
                      inputUsdValue,
                      USD_VALUE_MIN_DECIMALS,
                      USD_VALUE_MAX_DECIMALS
                    ),
                realUsdValue: priceImpactInputCanNotBeComputed
                  ? undefined
                  : formatTooltipNumbers(inputUsdValue),
                error: priceImpactInputCanNotBeComputed
                  ? errorMessages().unknownPriceError.impactTitle
                  : undefined,
              }}
              disabled={fetchMetaStatus === 'failed'}
              loading={fetchMetaStatus === 'loading'}
              loadingBalance={fetchingBalance}
              tooltipContainer={getContainer()}
              onSelectMaxBalance={() => {
                setInputAmount(tokenBalanceReal.split(',').join(''));
              }}
            />
            <SwitchFromAndToButton />
          </FromContainer>
          <SwapInput
            sharpBottomStyle={!!selectedQuote || fetchingQuote}
            label={i18n.t('To')}
            mode="To"
            fetchingQuote={fetchingQuote}
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
              realValue: formatTooltipNumbers(outputAmount),
              realUsdValue: priceImpactOutputCanNotBeComputed
                ? undefined
                : formatTooltipNumbers(outputUsdValue),
              error: priceImpactOutputCanNotBeComputed
                ? errorMessages().unknownPriceError.impactTitle
                : undefined,
            }}
            onClickToken={() => navigate(navigationRoutes.toSwap)}
            disabled={fetchMetaStatus === 'failed'}
            loading={fetchMetaStatus === 'loading'}
            tooltipContainer={getContainer()}
          />
        </InputsContainer>
        <Divider size="2" />
        <QuoteInfo
          quote={selectedQuote}
          loading={fetchingQuote}
          error={quoteError}
          tagHidden={false}
          warning={quoteWarning}
          type="basic"
          onClickAllRoutes={
            !!quotes && quotes.results.length > 1
              ? () => {
                  updateQuotePartialState('refetchQuote', false);
                  navigate(navigationRoutes.routes);
                }
              : undefined
          }
        />
        {quoteWarning || quoteError ? (
          <>
            <Divider size="10" />
            <QuoteWarningsAndErrors
              warning={quoteWarning}
              error={quoteError}
              loading={fetchingQuote}
              refetchQuote={fetchQuote}
              showWarningModal={showQuoteWarningModal}
              confirmationDisabled={!isActiveTab}
              onOpenWarningModal={() => setShowQuoteWarningModal(true)}
              onCloseWarningModal={() => setShowQuoteWarningModal(false)}
              onConfirmWarningModal={() => {
                setShowQuoteWarningModal(false);
                setQuoteWarningsConfirmed(true);
                navigate(navigationRoutes.confirmSwap);
              }}
              onChangeSettings={() => navigate(navigationRoutes.settings)}
            />
          </>
        ) : null}
      </PageContainer>
    </Layout>
  );
}
