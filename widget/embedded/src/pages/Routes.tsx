import type { SelectedQuote } from '../types';
import type { MultiRouteSimulationResult, PreferenceType } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider, Select, styled, Typography } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteSkeleton } from '../components/QuoteSkeleton';
import { navigationRoutes } from '../constants/navigationRoutes';
import { ROUTE_STRATEGY } from '../constants/quote';
import { QuoteInfo } from '../containers/QuoteInfo';
import { getQuoteError } from '../hooks/useConfirmSwap/useConfirmSwap.helpers';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSwapInput } from '../hooks/useSwapInput';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { getContainer } from '../utils/common';
import { generateQuoteWarnings, sortQuotesBy } from '../utils/quote';

const ITEM_SKELETON_COUNT = 3;
const StrategyContent = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '& .select_content': {
    width: '146px',
  },
});

export function RoutesPage() {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();

  const {
    selectedQuote,
    quotes,
    refetchQuote,
    setSelectedQuote,
    updateQuotePartialState,
    fromToken,
    toToken,
    sortStrategy,
    error: quoteError,
  } = useQuoteStore();
  const { slippage, customSlippage } = useAppStore();
  const tokens = useAppStore().tokens();

  const sortQuotes = quotes?.results
    ? sortQuotesBy(sortStrategy, quotes?.results)
    : [];

  const userSlippage = customSlippage ?? slippage;

  const { fetch: fetchQuote, loading: fetchingQuote } = useSwapInput({
    refetchQuote,
  });

  const onClickOnQuote = (quote: SelectedQuote) => {
    setSelectedQuote(quote);
    updateQuotePartialState('refetchQuote', false);
    navigateBack();
  };
  const getQuoteWarning = (quote: MultiRouteSimulationResult) => {
    if (!fromToken || !toToken || !quotes) {
      return null;
    }
    const mergedQuote: SelectedQuote = {
      requestAmount: quotes.requestAmount, // Assuming quotes is an array
      ...quote,
    };

    return generateQuoteWarnings(mergedQuote, {
      fromToken,
      toToken,
      userSlippage,
      tokens,
    });
  };
  const settings_url = `../${navigationRoutes.settings}`;
  const wallets_url = `../${navigationRoutes.wallets}`;
  return (
    <Layout
      header={{
        onWallet: () => {
          navigate(wallets_url);
        },
        onBack: () => {
          updateQuotePartialState('refetchQuote', false);
        },
        title: i18n.t('Routes'),
        suffix: (
          <HeaderButtons
            onClickRefresh={
              !!selectedQuote || quoteError ? fetchQuote : undefined
            }
            hidden={['notifications', 'history']}
            onClickSettings={() => navigate(settings_url)}
          />
        ),
      }}>
      <PageContainer>
        <StrategyContent>
          <Typography size="xmedium" variant="title">
            {i18n.t('Sort by')}
          </Typography>
          <div className="select_content">
            <Select
              container={getContainer()}
              options={ROUTE_STRATEGY}
              value={ROUTE_STRATEGY.find(
                (strategy) => strategy.value === sortStrategy
              )}
              handleItemClick={(item) => {
                updateQuotePartialState(
                  'sortStrategy',
                  item.value as PreferenceType
                );
              }}
            />
          </div>
        </StrategyContent>
        <Divider size="10" />

        {fetchingQuote
          ? Array.from({ length: ITEM_SKELETON_COUNT }, (_, index) => (
              <React.Fragment key={index}>
                <QuoteSkeleton
                  tagHidden={false}
                  type="list-item"
                  expanded={false}
                />
                <Divider size={16} />
              </React.Fragment>
            ))
          : !!quotes &&
            sortQuotes.map((quote) => {
              const quoteWarning = getQuoteWarning(quote);
              const quoteError = getQuoteError(quote.swaps);

              return (
                <React.Fragment key={quote.requestId}>
                  <QuoteInfo
                    selected={selectedQuote?.requestId === quote.requestId}
                    tagHidden={false}
                    quote={{ ...quote, requestAmount: quotes.requestAmount }}
                    loading={fetchingQuote}
                    error={quoteError?.options || null}
                    warning={quoteWarning}
                    onClick={(quote) => {
                      updateQuotePartialState('warning', quoteWarning);
                      updateQuotePartialState(
                        'error',
                        quoteError?.options || null
                      );
                      onClickOnQuote(quote);
                    }}
                    type="list-item"
                  />
                  <Divider size={16} />
                </React.Fragment>
              );
            })}
      </PageContainer>
    </Layout>
  );
}
