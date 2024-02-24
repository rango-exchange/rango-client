import { i18n } from '@lingui/core';
import { Button, Divider, styled, WarningIcon } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteWarningsAndErrors } from '../components/QuoteWarningsAndErrors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { ExpandedQuotes } from '../containers/ExpandedQuotes';
import { Inputs } from '../containers/Inputs';
import { QuoteInfo } from '../containers/QuoteInfo';
import useMobileDetect from '../hooks/useMobileDetect';
import { useSwapInput } from '../hooks/useSwapInput';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { getSwapButtonState } from '../utils/swap';

const MainContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  alignItems: 'flex-start',
  height: 700,
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
  const isMobile = useMobileDetect();

  const { fetch: fetchQuote, loading } = useSwapInput({ refetchQuote });
  const { config, fetchStatus: fetchMetaStatus } = useAppStore();

  const { connectedWallets } = useWalletsStore();
  const { isActiveTab } = useUiStore();
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);

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
  const isExpandable = config?.variant === 'expandable' && !isMobile;
  const hasInputs =
    !!inputAmount && !!fromToken && !!toToken && inputAmount !== '0';
  const fetchingQuote = hasInputs && fetchMetaStatus === 'success' && loading;

  const hasValidQuotes =
    !isExpandable || (isExpandable && quotes?.results.length);
  const hasWarningOrError = quoteWarning || quoteError;
  const showMessages = hasValidQuotes && hasWarningOrError;

  useEffect(() => {
    resetQuoteWallets();
    updateQuotePartialState('refetchQuote', true);
  }, []);

  useEffect(() => {
    setIsVisibleExpanded(hasInputs);
  }, [hasInputs]);

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

  return (
    <MainContainer>
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
                onHandleNavigation(navigationRoutes.wallets);
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
              tagHidden={false}
              warning={quoteWarning}
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

          {showMessages ? (
            <>
              <Divider size="10" />
              <QuoteWarningsAndErrors
                warning={quoteWarning}
                error={quoteError}
                refetchQuote={fetchQuote}
                showWarningModal={showQuoteWarningModal}
                confirmationDisabled={!isActiveTab}
                onOpenWarningModal={() => setShowQuoteWarningModal(true)}
                onCloseWarningModal={() => setShowQuoteWarningModal(false)}
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
        </PageContainer>
      </Layout>
      {isExpandable ? (
        <ExpandedQuotes
          loading={fetchingQuote}
          onClickOnQuote={(quote) => setSelectedQuote(quote)}
          fetch={fetchQuote}
          onClickRefresh={onClickRefresh}
          isVisible={isVisibleExpanded}
        />
      ) : null}
    </MainContainer>
  );
}
