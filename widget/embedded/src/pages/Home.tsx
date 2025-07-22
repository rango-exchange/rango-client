import type { SelectedQuote } from '../types';

import { i18n } from '@lingui/core';
import { Button, Divider, styled, WarningIcon } from '@arlert-dev/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteWarningsAndErrors } from '../components/QuoteWarningsAndErrors';
import { SameTokensWarning } from '../components/SameTokensWarning';
import { SlippageWarningsAndErrors } from '../components/SlippageWarningsAndErrors/SlippageWarningsAndErrors';
import { SwapMetrics } from '../components/SwapMetrics';
import { navigationRoutes } from '../constants/navigationRoutes';
import { SLIPPAGES } from '../constants/swapSettings';
import { ExpandedQuotes } from '../containers/ExpandedQuotes';
import { Inputs } from '../containers/Inputs';
import { QuoteInfo } from '../containers/QuoteInfo';
import useScreenDetect from '../hooks/useScreenDetect';
import { useSwapInput } from '../hooks/useSwapInput';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useUiStore } from '../store/ui';
import { UiEventTypes } from '../types';
import { isVariantExpandable } from '../utils/configs';
import { emitPreventableEvent } from '../utils/events';
import { getSlippageValidation } from '../utils/settings';
import { getSwapButtonState, isTokensIdentical } from '../utils/swap';

const MainContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  maxHeight: 700,
  '& .footer__alert': {
    paddingTop: '0 !important',
  },
});
export const TIME_TO_NAVIGATE_ANOTHER_PAGE = 300;

export function Home() {
  const navigate = useNavigate();
  const {
    fromToken,
    toToken,
    inputAmount,
    selectedQuote,
    refetchQuote,
    error: quoteError,
    warning: quoteWarning,
    quotes,
    setSelectedQuote,
    resetQuoteWallets,
    setQuoteWarningsConfirmed,
    updateQuotePartialState,
  } = useQuoteStore();

  const [isVisibleExpanded, setIsVisibleExpanded] = useState<boolean>(false);
  const { isLargeScreen, isExtraLargeScreen } = useScreenDetect();

  const { fetch: fetchQuote, loading } = useSwapInput({ refetchQuote });
  const {
    config,
    fetchStatus: fetchMetaStatus,
    connectedWallets,
    customSlippage,
    slippage,
    setSlippage,
    setCustomSlippage,
  } = useAppStore();

  const { isActiveTab } = useUiStore();
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);
  const currentSlippage = customSlippage !== null ? customSlippage : slippage;

  const slippageValidation = getSlippageValidation(currentSlippage);

  const needsToWarnEthOnPath = false;

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

  const isExpandable = isVariantExpandable(
    isLargeScreen,
    isExtraLargeScreen,
    config?.variant
  );

  const hasInputs =
    !!inputAmount &&
    !!fromToken &&
    !!toToken &&
    new BigNumber(inputAmount).gt(0) &&
    !isTokensIdentical(fromToken, toToken);

  const fetchingQuote = hasInputs && fetchMetaStatus === 'success' && loading;

  const currentQuoteWarning =
    slippageValidation?.quoteValidation || quoteWarning;

  const hasValidQuotes =
    !isExpandable || (isExpandable && quotes?.results.length);
  const hasWarningOrError = currentQuoteWarning || quoteError;
  const showMessages = hasValidQuotes && hasWarningOrError;

  const showSwapMetrics = !!fromToken && !!toToken;
  const showSlippageAlerts = showSwapMetrics && !!slippageValidation;

  const onClickRefresh =
    (!!selectedQuote || quoteError) && !showQuoteWarningModal
      ? fetchQuote
      : undefined;

  const onHandleNavigation = (route: string) => {
    if (isExpandable && isVisibleExpanded) {
      setIsVisibleExpanded(false);
      setTimeout(() => {
        navigate(route);
      }, TIME_TO_NAVIGATE_ANOTHER_PAGE);
    } else {
      navigate(route);
    }
  };
  const onClickOnQuote = (quote: SelectedQuote) => {
    if (selectedQuote?.requestId !== quote.requestId) {
      setShowQuoteWarningModal(false);
      setSelectedQuote(quote);
    }
  };

  const onChangeSlippage = (slippage: number | null) => {
    if (!slippage) {
      return;
    }
    if (SLIPPAGES.includes(slippage)) {
      setSlippage(slippage);
      setCustomSlippage(null);
      return;
    }
    setCustomSlippage(slippage);
  };

  useEffect(() => {
    resetQuoteWallets();
    updateQuotePartialState('refetchQuote', true);
  }, []);

  useEffect(() => {
    setIsVisibleExpanded(hasInputs);
  }, [hasInputs]);

  return (
    <MainContainer>
      <Layout
        height="auto"
        footer={
          // eslint-disable-next-line jsx-id-attribute-enforcement/missing-ids
          <Button
            id={`widget-swap-${swapButtonState.action}-btn`}
            type="primary"
            size="large"
            disabled={swapButtonState.disabled || !isActiveTab}
            prefix={
              swapButtonState.action === 'confirm-warning' && <WarningIcon />
            }
            fullWidth
            onClick={() => {
              if (swapButtonState.action === 'connect-wallet') {
                emitPreventableEvent(
                  { type: UiEventTypes.CLICK_CONNECT_WALLET },
                  () => onHandleNavigation(navigationRoutes.wallets)
                );
              } else if (swapButtonState.action === 'confirm-warning') {
                setShowQuoteWarningModal(true);
              } else {
                onHandleNavigation(navigationRoutes.confirmSwap);
              }
            }}>
            {swapButtonState.title}
          </Button>
        }
        header={{
          onWallet: () => {
            onHandleNavigation(navigationRoutes.wallets);
          },
          hasBackButton: false,
          title: config.title || i18n.t('Swap'),
          suffix: (
            <HeaderButtons
              hidden={isExpandable ? ['refresh'] : undefined}
              onClickRefresh={onClickRefresh}
              onClickHistory={() => onHandleNavigation(navigationRoutes.swaps)}
              onClickSettings={() => {
                onHandleNavigation(navigationRoutes.settings);
              }}
            />
          ),
        }}>
        <PageContainer>
          <Inputs
            fetchingQuote={fetchingQuote}
            fetchMetaStatus={fetchMetaStatus}
            isExpandable={isExpandable}
            onClickToken={(mode) => {
              onHandleNavigation(
                mode === 'from'
                  ? navigationRoutes.fromSwap
                  : navigationRoutes.toSwap
              );
            }}
          />
          <Divider size="2" />
          {!isExpandable ? (
            <QuoteInfo
              quote={selectedQuote}
              loading={fetchingQuote}
              error={quoteError}
              id="widget-home-expandable-quote-container"
              tagHidden={false}
              warning={currentQuoteWarning}
              type="basic"
              onClickAllRoutes={
                !!quotes && quotes.results.length > 1
                  ? () => {
                      updateQuotePartialState('refetchQuote', false);
                      onHandleNavigation(navigationRoutes.routes);
                    }
                  : undefined
              }
            />
          ) : null}
          {showSwapMetrics && (
            <>
              <Divider size={8} />
              <SwapMetrics
                quoteError={quoteError}
                quoteWarning={currentQuoteWarning}
                fromToken={fromToken}
                toToken={toToken}
                quote={selectedQuote}
                loading={fetchingQuote}
              />
            </>
          )}

          {showMessages ? (
            <>
              <QuoteWarningsAndErrors
                warning={currentQuoteWarning}
                error={quoteError}
                skipAlerts={!!slippageValidation}
                couldChangeSettings={true}
                refetchQuote={fetchQuote}
                showWarningModal={showQuoteWarningModal}
                confirmationDisabled={!isActiveTab}
                onOpenWarningModal={() => setShowQuoteWarningModal(true)}
                onCloseWarningModal={() => setShowQuoteWarningModal(false)}
                onChangeSlippage={onChangeSlippage}
                onConfirmWarningModal={() => {
                  setShowQuoteWarningModal(false);
                  setQuoteWarningsConfirmed(true);
                  onHandleNavigation(navigationRoutes.confirmSwap);
                }}
                onChangeSettings={() =>
                  onHandleNavigation(navigationRoutes.settings)
                }
              />
            </>
          ) : null}

          {showSlippageAlerts && (
            <>
              <Divider size="10" />
              <SlippageWarningsAndErrors
                onChangeSettings={() =>
                  onHandleNavigation(navigationRoutes.settings)
                }
              />
            </>
          )}
          <SameTokensWarning />
        </PageContainer>
      </Layout>
      {isExpandable ? (
        <ExpandedQuotes
          loading={fetchingQuote}
          onClickOnQuote={onClickOnQuote}
          fetch={fetchQuote}
          onClickRefresh={onClickRefresh}
          isVisible={isVisibleExpanded}
        />
      ) : null}
    </MainContainer>
  );
}
