import type { PropTypes } from './Quotes.types';
import type { MultiRouteSimulationResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider, FullExpandedQuote, Typography } from '@rango-dev/ui';
import React from 'react';

import { QuoteInfo } from '../../containers/QuoteInfo';
import { getQuoteError } from '../../hooks/useConfirmSwap/useConfirmSwap.helpers';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType, type SelectedQuote } from '../../types';
import { getContainer } from '../../utils/common';
import { generateQuoteWarnings, sortQuotesBy } from '../../utils/quote';
import { NoResult } from '../NoResult';
import { QuoteSkeleton } from '../QuoteSkeleton';

import { ErrorsContainer, StrategyContent } from './Quotes.styles';
import { SelectStrategy } from './SelectStrategy';

const ITEM_SKELETON_COUNT = 3;
export function Quotes(props: PropTypes) {
  const {
    loading,
    onClickOnQuote,
    fetch,
    showModalFee,
    hasSort = true,
    fullExpandedMode = false,
  } = props;
  const {
    selectedQuote,
    quotes,
    updateQuotePartialState,
    fromToken,
    toToken,
    sortStrategy,
    error,
  } = useQuoteStore();
  const { slippage, customSlippage } = useAppStore();
  const tokens = useAppStore().tokens();
  const hasQuotes = !!quotes && quotes.results.length;
  const userSlippage = customSlippage ?? slippage;
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
  const showNoResultMessage =
    error?.type === QuoteErrorType.NO_RESULT ||
    error?.type === QuoteErrorType.REQUEST_FAILED;

  const sortQuotes = quotes?.results
    ? sortQuotesBy(sortStrategy, quotes?.results)
    : [];

  return (
    <>
      {loading &&
        Array.from({ length: ITEM_SKELETON_COUNT }, (_, index) => (
          <React.Fragment key={index}>
            {fullExpandedMode ? (
              <FullExpandedQuote loading />
            ) : (
              <QuoteSkeleton
                tagHidden={false}
                type="list-item"
                expanded={false}
              />
            )}
            <Divider size={16} />
          </React.Fragment>
        ))}

      {!loading && (
        <>
          {hasSort && (
            <>
              <StrategyContent>
                <Typography size="xmedium" variant="title">
                  {i18n.t('Sort by')}
                </Typography>
                <SelectStrategy container={getContainer()} />
              </StrategyContent>
              <Divider size="10" />
            </>
          )}
          {hasQuotes
            ? sortQuotes.map((quote) => {
                const quoteWarning = getQuoteWarning(quote);
                const quoteError = getQuoteError(quote.swaps);

                return (
                  <React.Fragment key={quote.requestId}>
                    <QuoteInfo
                      showModalFee={showModalFee}
                      selected={selectedQuote?.requestId === quote.requestId}
                      tagHidden={false}
                      quote={{ ...quote, requestAmount: quotes.requestAmount }}
                      loading={loading}
                      error={quoteError?.options || null}
                      warning={quoteWarning}
                      fullExpandedMode={fullExpandedMode}
                      onClick={(quote) => {
                        if (!quoteError) {
                          updateQuotePartialState('warning', quoteWarning);
                        }
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
              })
            : showNoResultMessage && (
                <ErrorsContainer>
                  <NoResult
                    size={fullExpandedMode ? 'large' : 'small'}
                    error={error}
                    fetch={fetch}
                  />
                </ErrorsContainer>
              )}
        </>
      )}
    </>
  );
}
