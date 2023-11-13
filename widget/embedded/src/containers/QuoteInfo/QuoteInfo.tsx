import type { PropTypes } from './QuoteInfo.types';

import { Divider } from '@rango-dev/ui';
import React from 'react';

import { Quote, QuoteSkeleton } from '../../components/Quote';
import { QuoteWarningsAndErrors } from '../../components/QuoteWarningsAndErrors';
import {
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { useQuoteStore } from '../../store/quote';
import { numberToString } from '../../utils/numbers';

import { QuoteContainer } from './QuoteInfo.styles';

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
    expanded = false,
  } = props;
  const { inputAmount, inputUsdValue, outputUsdValue, outputAmount } =
    useQuoteStore();

  const showQuote = quote && quote.result && !loading;
  return (
    <>
      {loading && (
        <QuoteContainer>
          <QuoteSkeleton type={type} expanded={expanded} />
        </QuoteContainer>
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
              value: numberToString(
                inputAmount,
                TOKEN_AMOUNT_MIN_DECIMALS,
                TOKEN_AMOUNT_MAX_DECIMALS
              ),
              usdValue: numberToString(
                inputUsdValue,
                USD_VALUE_MIN_DECIMALS,
                USD_VALUE_MAX_DECIMALS
              ),
            }}
            output={{
              value: numberToString(
                outputAmount,
                TOKEN_AMOUNT_MIN_DECIMALS,
                TOKEN_AMOUNT_MAX_DECIMALS
              ),
              usdValue: numberToString(
                outputUsdValue,
                USD_VALUE_MIN_DECIMALS,
                USD_VALUE_MAX_DECIMALS
              ),
            }}
          />
        </QuoteContainer>
      ) : null}

      {!warning && !error && <Divider size={16} />}

      {(warning || error) && (
        <QuoteWarningsAndErrors
          warning={warning}
          error={error}
          loading={loading}
          refetchQuote={refetchQuote}
          showWarningModal={showWarningModal}
          onOpenWarningModal={onOpenWarningModal}
          onCloseWarningModal={onCloseWarningModal}
          onConfirmWarningModal={onConfirmWarningModal}
        />
      )}
    </>
  );
}
