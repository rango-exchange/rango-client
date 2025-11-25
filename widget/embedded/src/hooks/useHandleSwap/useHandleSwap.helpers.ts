import type { ConfirmSwapFetchResult } from './useHandleSwap.types';
import type { FindToken } from '../../store/slices/data';
import type {
  ConfirmSwapWarnings,
  QuoteErrorResponse,
  QuoteResponse,
  SelectedQuote,
  Wallet,
} from '../../types';
import type BigNumber from 'bignumber.js';
import type { SwapResult } from 'rango-sdk';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType } from '../../types';
import { generateQuoteWarnings } from '../../utils/quote';
import {
  checkSlippageErrors,
  generateBalanceWarnings,
  getLimitErrorMessage,
  getMinRequiredSlippage,
  hasLimitError,
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

export function generateWarnings(params: {
  currentQuote: SelectedQuote;
  previousQuote?: SelectedQuote;
  selectedWallets: Wallet[];
  userSlippage: number;
  inputUsdValue: BigNumber | null;
  findToken: FindToken;
}): ConfirmSwapWarnings {
  const {
    currentQuote,
    previousQuote,
    selectedWallets,
    userSlippage,
    findToken,
  } = params;

  const output: ConfirmSwapWarnings = {
    quote: null,
    balance: null,
  };

  const quoteWarning = generateQuoteWarnings({
    previousQuote,
    currentQuote,
    findToken,
    userSlippage,
  });

  if (quoteWarning) {
    output.quote = quoteWarning;
  }

  const balanceWarnings = generateBalanceWarnings(
    currentQuote,
    selectedWallets
  );

  const enoughBalance = !balanceWarnings;

  if (!enoughBalance) {
    output.balance = {
      messages: balanceWarnings,
    };
  }

  return output;
}

export function handleQuoteErrors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
): NonNullable<ConfirmSwapFetchResult['error']> {
  if (error?.code === 'ERR_CANCELED') {
    return {
      type: QuoteErrorType.REQUEST_CANCELED,
    };
  }

  if (error.cause) {
    return error.cause;
  }

  if (error?.code === 'ERR_BAD_REQUEST') {
    return {
      type: QuoteErrorType.NO_RESULT,
      diagnosisMessage: error.response.data.error,
    };
  }

  return {
    type: QuoteErrorType.REQUEST_FAILED,
    diagnosisMessage: error.message,
  };
}
