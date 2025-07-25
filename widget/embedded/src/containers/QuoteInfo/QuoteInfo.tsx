import type { PropTypes } from './QuoteInfo.types';

import BigNumber from 'bignumber.js';
import React from 'react';

import { Quote } from '../../components/Quote';
import { QuoteSkeleton } from '../../components/QuoteSkeleton';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';
import { getUsdOutputFrom } from '../../utils/swap';

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
    showModalFee,
    selected,
    id,
    onClickAllRoutes,
    fullExpandedMode = false,
    container,
  } = props;
  const { inputAmount, inputUsdValue } = useQuoteStore();

  const outputAmount = !!quote?.outputAmount
    ? new BigNumber(quote?.outputAmount)
    : null;
  const outputUsdValue = quote ? getUsdOutputFrom(quote) : null;

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
    <QuoteContainer onClick={() => onClick?.(quote)} id={id}>
      <Quote
        quote={quote}
        error={error}
        container={container}
        showModalFee={showModalFee}
        warning={warning}
        tagHidden={tagHidden}
        selected={selected}
        type={type}
        expanded={expanded}
        onClickAllRoutes={onClickAllRoutes}
        fullExpandedMode={fullExpandedMode}
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
