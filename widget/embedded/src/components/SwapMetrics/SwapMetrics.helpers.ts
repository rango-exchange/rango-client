import type { SlippageColorParams } from './SwapMetrics.types';

import BigNumber from 'bignumber.js';

import { QuoteErrorType, QuoteWarningType } from '../../types';

import {
  LARGE_VALUE_MAX_DIGITS,
  SMALL_VALUE_DECIMALS,
  USD_EXCHANGE_MINIMUM,
  USD_FORMAT_DECIMALS,
} from './SwapMetrics.constants';

export function getSlippageColor(params: SlippageColorParams) {
  const { error, isDarkTheme, warning } = params;
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
}

export function getUsdExchangeRate(params: {
  toTokenUsdPrice: number | null;
  fromTokenUsdPrice: number | null;
}) {
  const { toTokenUsdPrice, fromTokenUsdPrice } = params;
  if (!toTokenUsdPrice || !fromTokenUsdPrice) {
    return { rawValue: '0', displayValue: '0' };
  }
  const toPrice = new BigNumber(toTokenUsdPrice);
  const fromPrice = new BigNumber(fromTokenUsdPrice);
  const rawValue = toPrice.dividedBy(fromPrice);
  let displayValue: string;

  if (rawValue.isLessThan(1)) {
    /*
     * Format the number with up to SMALL_VALUE_DECIMALS digits after the decimal point,
     * then remove any trailing zeros.
     * Example: "0.120000" → "0.12", "0.00000000000010" → "0.0000000000001"
     */
    displayValue = rawValue.toFixed(SMALL_VALUE_DECIMALS).replace(/\.?0+$/, '');
  } else if (rawValue.toFixed(0).length > LARGE_VALUE_MAX_DIGITS) {
    displayValue = rawValue.toFixed(0).slice(0, LARGE_VALUE_MAX_DIGITS);
  } else {
    displayValue = rawValue.toFixed(USD_FORMAT_DECIMALS);
  }
  return {
    displayValue,
    rawValue: rawValue.toFixed(),
  };
}

export function formatTokenValueInUsd(
  usdExchangeRate: number,
  tokenUsdPrice: number
): string {
  const value = new BigNumber(usdExchangeRate).multipliedBy(tokenUsdPrice);
  if (value.isLessThan(USD_EXCHANGE_MINIMUM)) {
    return '$0';
  }
  const result = value
    .decimalPlaces(USD_FORMAT_DECIMALS, BigNumber.ROUND_DOWN)
    .toFormat(USD_FORMAT_DECIMALS);

  return `$${result}`;
}
