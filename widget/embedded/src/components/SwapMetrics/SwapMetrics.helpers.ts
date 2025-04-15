import type { SlippageColorParams } from './SwapMetrics.types';
import type { QuoteTokensRate } from '../../store/slices/settings';

import BigNumber from 'bignumber.js';

import { QuoteErrorType, QuoteWarningType } from '../../types';

import {
  USD_EXCHANGE_RATE_DECIMALS,
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
  quoteTokensRate: QuoteTokensRate;
}): number {
  const { toTokenUsdPrice, fromTokenUsdPrice, quoteTokensRate } = params;
  if (toTokenUsdPrice && fromTokenUsdPrice) {
    const toPrice = new BigNumber(toTokenUsdPrice);
    const fromPrice = new BigNumber(fromTokenUsdPrice);
    return quoteTokensRate === 'default'
      ? Number(toPrice.dividedBy(fromPrice).toFixed(USD_EXCHANGE_RATE_DECIMALS))
      : Number(
          fromPrice.dividedBy(toPrice).toFixed(USD_EXCHANGE_RATE_DECIMALS)
        );
  }
  return 0;
}

export function formatTokenValueInUsd(
  usdExchangeRate: number,
  tokenUsdPrice: number
): string {
  const value = usdExchangeRate * tokenUsdPrice;

  const result = new BigNumber(value)
    .decimalPlaces(USD_FORMAT_DECIMALS, BigNumber.ROUND_DOWN)
    .toFormat(USD_FORMAT_DECIMALS);

  return `$${result}`;
}
