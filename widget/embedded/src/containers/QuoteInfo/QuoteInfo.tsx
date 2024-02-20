import type { PropTypes } from './QuoteInfo.types';

import BigNumber from 'bignumber.js';
import React from 'react';

import { Quote } from '../../components/Quote';
import { QuoteSkeleton } from '../../components/QuoteSkeleton';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';
import { getQuoteToTokenUsdPrice } from '../../utils/quote';
import { calcOutputUsdValue } from '../../utils/swap';

import { QuoteContainer } from './QuoteInfo.styles';

export function QuoteInfo(props: PropTypes) {
  const {
    quote,
    type,
    loading,
    error,
    warning,
    expanded = false,
    tagHidden,
    onClick,
    selected,
    onClickAllRoutes,
  } = props;
  const { inputAmount, inputUsdValue, toToken } = useQuoteStore();

  const outputAmount = !!quote?.outputAmount
    ? new BigNumber(quote?.outputAmount)
    : null;
  const outputUsdValue = !!quote?.outputAmount
    ? calcOutputUsdValue(
        quote?.outputAmount,
        getQuoteToTokenUsdPrice(quote) || toToken?.usdPrice
      )
    : null;

  const noResult =
    error &&
    (error.type === QuoteErrorType.NO_RESULT ||
      error.type === QuoteErrorType.REQUEST_FAILED);

  const showQuote = !noResult && quote && !loading;

  if (loading) {
    return (
      <QuoteContainer>
        <QuoteSkeleton tagHidden={tagHidden} type={type} expanded={expanded} />
      </QuoteContainer>
    );
  }

  return showQuote ? (
    <QuoteContainer onClick={() => onClick?.(quote)}>
      <Quote
        quote={quote}
        error={error}
        warning={warning}
        tagHidden={tagHidden}
        selected={selected}
        type={type}
        expanded={expanded}
        onClickAllRoutes={onClickAllRoutes}
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
