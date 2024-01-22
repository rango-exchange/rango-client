import type { PropTypes } from './QuoteInfo.types';

import React from 'react';

import { Quote } from '../../components/Quote';
import { QuoteSkeleton } from '../../components/QuoteSkeleton';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';

import { QuoteContainer } from './QuoteInfo.styles';

export function QuoteInfo(props: PropTypes) {
  const { quote, type, loading, error, warning, expanded = false } = props;
  const { inputAmount, inputUsdValue, outputUsdValue, outputAmount } =
    useQuoteStore();

  const noResult =
    error &&
    (error.type === QuoteErrorType.NO_RESULT ||
      error.type === QuoteErrorType.REQUEST_FAILED);

  const showQuote = !noResult && quote && quote.result && !loading;

  if (loading) {
    return (
      <QuoteContainer>
        <QuoteSkeleton type={type} expanded={expanded} />
      </QuoteContainer>
    );
  }

  return showQuote ? (
    <QuoteContainer>
      <Quote
        quote={quote}
        error={error}
        warning={warning}
        type={type}
        expanded={expanded}
        recommended={true}
        input={{
          value: inputAmount,
          usdValue: inputUsdValue?.toString() ?? '',
        }}
        output={{
          value: outputAmount?.toString() ?? '',
          usdValue: outputUsdValue?.toString() ?? '',
        }}
      />
    </QuoteContainer>
  ) : null;
}
