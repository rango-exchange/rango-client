import type { PropTypes } from './Quotes.types';
import type { MultiRouteSimulationResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider, FullExpandedQuote, Typography } from '@arlert-dev/ui';
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
    container: propContainer,
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
  const { findToken } = useAppStore();
  const container = propContainer || getContainer();
  const hasQuotes = !!quotes && quotes.results.length;
  const userSlippage = customSlippage ?? slippage;
  const getQuoteWarning = (quote: MultiRouteSimulationResult) => {
    if (!fromToken || !toToken || !quotes) {
      return null;
    }
    const mergedQuote: SelectedQuote = {
      requestAmount: quotes.requestAmount, // Assuming quotes is an array
      validationStatus: null,
      ...quote,
    };

    return generateQuoteWarnings({
      currentQuote: mergedQuote,
      userSlippage,
      findToken,
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
      {hasSort && (
        <>
          <StrategyContent>
            <Typography size="xmedium" variant="title">
              {i18n.t('Sort by')}
            </Typography>
            <SelectStrategy container={container} />
          </StrategyContent>
          <Divider size="10" />
        </>
      )}

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
            {index !== ITEM_SKELETON_COUNT - 1 && <Divider size={16} />}
          </React.Fragment>
        ))}

      {!loading && (
        <>
          {hasQuotes
            ? sortQuotes.map((quote, index) => {
                const quoteWarning = getQuoteWarning(quote);
                const quoteError = getQuoteError(quote.swaps);
                const lastIndex = sortQuotes.length - 1 === index;

                return (
                  <React.Fragment key={quote.requestId}>
                    <QuoteInfo
                      id="widget-quotes-quote-info-container"
                      showModalFee={showModalFee}
                      container={container}
                      selected={selectedQuote?.requestId === quote.requestId}
                      tagHidden={false}
                      quote={{
                        ...quote,
                        requestAmount: quotes.requestAmount,
                        validationStatus: null,
                      }}
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
                    {!lastIndex && <Divider size={16} />}
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
