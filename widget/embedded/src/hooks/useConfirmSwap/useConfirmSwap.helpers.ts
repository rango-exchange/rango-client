import type { ConfirmSwapFetchResult } from './useConfirmSwap.types';
import type { ConfirmSwapWarnings, Wallet } from '../../types';
import type { BestRouteResponse, Token } from 'rango-sdk';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType, QuoteUpdateType } from '../../types';
import { numberToString } from '../../utils/numbers';
import {
  generateQuoteWarnings,
  isNumberOfSwapsChanged,
  isQuoteChanged,
  isQuoteInternalCoinsUpdated,
  isQuoteSwappersUpdated,
} from '../../utils/quote';
import {
  checkSlippageErrors,
  getBalanceWarnings,
  getLimitErrorMessage,
  getMinRequiredSlippage,
  getPercentageChange,
  getQuoteOutputAmount,
  hasLimitError,
  isOutputAmountChangedALot,
} from '../../utils/swap';

/**
 * A request can be successful but in body of the response, it can be some case which is considered as failed.
 */
export function throwErrorIfResponseIsNotValid(response: BestRouteResponse) {
  if (!response.result) {
    throw new Error(errorMessages().noResultError.title, {
      cause: {
        type: QuoteErrorType.NO_RESULT,
        diagnosisMessage: response.diagnosisMessages?.[0],
      },
    });
  }
  const limitError = hasLimitError(response);
  if (limitError) {
    const { swap, recommendation, fromAmountRangeError } =
      getLimitErrorMessage(response);

    throw new Error('bridge limit error', {
      cause: {
        type: QuoteErrorType.BRIDGE_LIMIT,
        swap: swap,
        recommendation,
        fromAmountRangeError,
      },
    });
  }

  const recommendedSlippages = checkSlippageErrors(response);

  if (recommendedSlippages) {
    const minRequiredSlippage = getMinRequiredSlippage(response);
    throw new Error('', {
      cause: {
        type: QuoteErrorType.INSUFFICIENT_SLIPPAGE,
        recommendedSlippages,
        minRequiredSlippage,
      },
    });
  }

  return response;
}

export function generateWarnings(
  previousQuote: BestRouteResponse,
  currentQuote: BestRouteResponse,
  params: {
    fromToken: Token;
    toToken: Token;
    tokens: Token[];
    selectedWallets: Wallet[];
    userSlippage: number;
  }
): ConfirmSwapWarnings {
  const quoteChanged = isQuoteChanged(previousQuote, currentQuote);
  const output: ConfirmSwapWarnings = {
    quote: null,
    quoteUpdate: null,
    balance: null,
  };

  const quoteWarning = generateQuoteWarnings(currentQuote, {
    fromToken: params.fromToken,
    toToken: params.toToken,
    tokens: params.tokens,
    userSlippage: params.userSlippage,
  });

  if (quoteWarning) {
    output.quote = quoteWarning;
  }

  if (quoteChanged) {
    if (isOutputAmountChangedALot(previousQuote, currentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED,
        newOutputAmount: numberToString(getQuoteOutputAmount(currentQuote)),
        percentageChange: numberToString(
          getPercentageChange(
            getQuoteOutputAmount(previousQuote) ?? '',
            getQuoteOutputAmount(currentQuote) ?? ''
          ),
          null,
          2
        ),
      };
    } else if (isNumberOfSwapsChanged(previousQuote, currentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_UPDATED,
      };
    } else if (isQuoteSwappersUpdated(previousQuote, currentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_SWAPPERS_UPDATED,
      };
    } else if (isQuoteInternalCoinsUpdated(previousQuote, currentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_COINS_UPDATED,
      };
    }
  }

  const balanceWarnings = getBalanceWarnings(
    currentQuote,
    params.selectedWallets
  );
  const enoughBalance = balanceWarnings.length === 0;

  if (!enoughBalance) {
    output.balance = {
      messages: balanceWarnings,
    };
  }

  return output;
}

export function handleQuoteErrors(error: any): ConfirmSwapFetchResult {
  if (error?.code === 'ERR_CANCELED') {
    return {
      swap: null,
      error: {
        type: QuoteErrorType.REQUEST_CANCELED,
      },
      warnings: null,
    };
  }

  if (error.cause) {
    return {
      swap: null,
      error: error.cause,
      warnings: null,
    };
  }

  return {
    swap: null,
    error: {
      type: QuoteErrorType.REQUEST_FAILED,
    },
    warnings: null,
  };
}
