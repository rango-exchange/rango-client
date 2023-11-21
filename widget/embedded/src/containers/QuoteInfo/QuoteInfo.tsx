import type { PropTypes } from './QuoteInfo.types';

import { Divider } from '@rango-dev/ui';
import React from 'react';

import { Quote, QuoteSkeleton } from '../../components/Quote';
import { QuoteWarningsAndErrors } from '../../components/QuoteWarningsAndErrors';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';

import {
  PositionTopAlerts,
  QuoteContainer,
  SkeletonContainer,
} from './QuoteInfo.styles';

export function QuoteInfo(props: PropTypes) {
  const {
    quote,
    type,
    loading,
    error,
    warning,
    refetchQuote,
    showWarningModal,
    onOpenWarningModal,
    onCloseWarningModal,
    onConfirmWarningModal,
    onChangeSettings,
    expanded = false,
    alertPosition = 'bottom',
  } = props;
  const { inputAmount, inputUsdValue, outputUsdValue, outputAmount } =
    useQuoteStore();

  const noResult =
    error &&
    (error.type === QuoteErrorType.NO_RESULT ||
      error.type === QuoteErrorType.REQUEST_FAILED);

  const showQuote = !noResult && quote && quote.result && !loading;

  const quoteWarningsAndErrors = (warning || error) && (
    <QuoteWarningsAndErrors
      warning={warning}
      error={error}
      loading={loading}
      refetchQuote={refetchQuote}
      showWarningModal={showWarningModal}
      onOpenWarningModal={onOpenWarningModal}
      onCloseWarningModal={onCloseWarningModal}
      onConfirmWarningModal={onConfirmWarningModal}
      onChangeSettings={onChangeSettings}
    />
  );
  return (
    <>
      {loading && (
        <QuoteContainer>
          <SkeletonContainer paddingTop={alertPosition === 'top'}>
            <QuoteSkeleton type={type} expanded={expanded} />
          </SkeletonContainer>
        </QuoteContainer>
      )}

      {alertPosition === 'top' && (
        <PositionTopAlerts>{quoteWarningsAndErrors}</PositionTopAlerts>
      )}
      {showQuote ? (
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
      ) : null}

      {alertPosition === 'bottom' && (
        <>
          {!warning && !error && <Divider size={16} />}
          {quoteWarningsAndErrors}
        </>
      )}
    </>
  );
}
