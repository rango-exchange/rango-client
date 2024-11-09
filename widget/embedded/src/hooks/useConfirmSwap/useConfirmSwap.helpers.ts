import type { ConfirmSwapFetchResult } from './useConfirmSwap.types';
import type { FindToken } from '../../store/slices/data';
import type {
  ConfirmSwapWarnings,
  QuoteErrorResponse,
  QuoteResponse,
  SelectedQuote,
  Wallet,
} from '../../types';
import type { BlockchainMeta, SwapResult, Token } from 'rango-sdk';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType, QuoteUpdateType } from '../../types';
import { numberToString } from '../../utils/numbers';
import {
  generateQuoteWarnings,
  getPriceImpact,
  isNumberOfSwapsChanged,
  isQuoteChanged,
  isQuoteInternalCoinsUpdated,
  isQuoteSwappersUpdated,
} from '../../utils/quote';
import {
  checkSlippageErrors,
  generateBalanceWarnings,
  getLimitErrorMessage,
  getMinRequiredSlippage,
  getQuoteOutputAmount,
  hasLimitError,
  isOutputAmountChangedALot,
} from '../../utils/swap';

/**
 * A request can be successful but in body of the response, it can be some case which is considered as failed.
 */
export function throwErrorIfResponseIsNotValid(response: QuoteResponse) {
  if (!response.swaps) {
    throw new Error(errorMessages().noResultError.title, {
      cause: {
        type: QuoteErrorType.NO_RESULT,
        diagnosisMessage: response.diagnosisMessages?.[0],
      },
    });
  }
  const quoteError = getQuoteError(response.swaps);
  if (quoteError) {
    throw new Error(quoteError.message, {
      cause: quoteError.options,
    });
  }
}

export function getQuoteError(swaps: SwapResult[]): QuoteErrorResponse | null {
  const limitError = hasLimitError(swaps);
  if (limitError) {
    const { swap, recommendation, fromAmountRangeError } =
      getLimitErrorMessage(swaps);
    return {
      message: 'bridge limit error',
      options: {
        type: QuoteErrorType.BRIDGE_LIMIT,
        swap,
        recommendation,
        fromAmountRangeError,
      },
    };
  }

  const recommendedSlippages = checkSlippageErrors(swaps);

  if (recommendedSlippages) {
    const minRequiredSlippage = getMinRequiredSlippage(swaps);
    return {
      message: '',
      options: {
        type: QuoteErrorType.INSUFFICIENT_SLIPPAGE,
        recommendedSlippages,
        minRequiredSlippage,
      },
    };
  }
  return null;
}

export function generateWarnings(
  previousQuote: SelectedQuote | undefined,
  currentQuote: SelectedQuote,
  params: {
    fromToken: Token;
    toToken: Token;
    meta: { blockchains: BlockchainMeta[] };
    selectedWallets: Wallet[];
    userSlippage: number;
    findToken: FindToken;
  }
): ConfirmSwapWarnings {
  let quoteChanged = false;
  if (previousQuote) {
    quoteChanged = isQuoteChanged(previousQuote, currentQuote);
  }
  const output: ConfirmSwapWarnings = {
    quote: null,
    quoteUpdate: null,
    balance: null,
  };

  const quoteWarning = generateQuoteWarnings(currentQuote, {
    fromToken: params.fromToken,
    toToken: params.toToken,
    findToken: params.findToken,
    userSlippage: params.userSlippage,
  });

  if (quoteWarning) {
    output.quote = quoteWarning;
  }

  if (previousQuote && quoteChanged) {
    if (isOutputAmountChangedALot(previousQuote, currentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED,
        newOutputAmount: numberToString(getQuoteOutputAmount(currentQuote)),
        percentageChange: numberToString(
          getPriceImpact(
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

  const balanceWarnings = generateBalanceWarnings(
    currentQuote,
    params.selectedWallets,
    params.meta.blockchains
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

  if (error?.code === 'ERR_BAD_REQUEST') {
    return {
      swap: null,
      error: {
        type: QuoteErrorType.NO_RESULT,
        diagnosisMessage: error.response.data.error,
      },
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
