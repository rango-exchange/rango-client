import type { QuoteError, QuoteWarning } from '../../types';

import BigNumber from 'bignumber.js';

import { QuoteErrorType, QuoteWarningType } from '../../types';
import { numberToString } from '../../utils/numbers';

export const getSlippageColor = (
  error: { quoteError: QuoteError | null; slippageError: string | null },
  warning: {
    quoteWarning: QuoteWarning | null;
    slippageWarning: string | null;
  },
  isDarkTheme: boolean
) => {
  const { quoteError, slippageError } = error;
  const { quoteWarning, slippageWarning } = warning;
  const hasSlippageError =
    !!slippageError ||
    quoteError?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE;
  const hasSlippageWarning =
    !!slippageWarning ||
    quoteWarning?.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE;

  if (hasSlippageError) {
    return '$error500';
  } else if (hasSlippageWarning) {
    return '$warning500';
  }
  if (isDarkTheme) {
    return '$neutral600';
  }
  return '$neutral700';
};

export const getUsdExchangeRate = (
  toTokenUsdPrice: number | null,
  fromTokenUsdPrice: number | null
): number => {
  const MAX_DECIMALS = 5;

  if (toTokenUsdPrice && fromTokenUsdPrice) {
    const toPrice = new BigNumber(toTokenUsdPrice);
    const fromPrice = new BigNumber(fromTokenUsdPrice);
    return Number(toPrice.dividedBy(fromPrice).toFixed(MAX_DECIMALS));
  }
  return 0;
};

export const formatTokenValueInUsd = (
  usdExchangeRate: number,
  tokenUsdPrice: number
): string => {
  const MAX_DECIMALS = 2;

  const value = usdExchangeRate * tokenUsdPrice;
  return `$${numberToString(value.toFixed(MAX_DECIMALS))}`;
};
