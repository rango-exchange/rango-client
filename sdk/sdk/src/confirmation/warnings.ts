import type {
  ConfirmedRoute,
  ConfirmQuoteWarnings,
  HighSlippageWarning,
  HighValueLossWarning,
  InsufficientSlippageWarning,
  OutputChangeWarning,
  SelectedQuote,
} from './types';
import type { SdkMeta } from '../execution/context';
import type { SwapResult } from 'rango-sdk';

import BigNumber from 'bignumber.js';

import { findToken } from '../execution/actions/meta';

import {
  HIGH_PRICE_IMPACT,
  HIGH_SLIPPAGE,
  HIGH_VALUE_LOSS_CRITERIA,
  OUTPUT_CHANGE_CRITERIA,
  PERCENT_MULTIPLIER,
} from './constants';
import { getMinRequiredSlippage } from './slippage';

export type QuoteWarnings = Omit<ConfirmQuoteWarnings, 'balance'>;

/**
 * The warnings a confirmed route earns on its own and against the quote the
 * user picked. Every check runs; none of them looks at balances.
 */
export function getQuoteWarnings(params: {
  quote: SelectedQuote;
  route: ConfirmedRoute;
  /** The user's slippage, in percent. */
  slippage: string;
  /** Prices fees from its tokens when they are there. */
  meta: SdkMeta;
}): QuoteWarnings {
  const { quote, route, slippage, meta } = params;
  const swaps = route.result?.swaps ?? [];
  const inputUsd = toUsd(route.requestAmount, swaps[0]?.from.usdPrice);
  const outputUsd = toUsd(
    route.result?.outputAmount,
    swaps[swaps.length - 1]?.to.usdPrice
  );

  return {
    highValueLoss:
      inputUsd && outputUsd
        ? findHighValueLoss(inputUsd, outputUsd, swaps, meta)
        : null,
    outputChange: findOutputChange(quote, route),
    unknownPrice:
      inputUsd && outputUsd ? null : { input: !inputUsd, output: !outputUsd },
    ...getSlippageWarnings(swaps, slippage),
  };
}

/** `null` when the amount is missing, or the token has no price. */
function toUsd(
  amount: string | null | undefined,
  usdPrice: number | null | undefined
): BigNumber | null {
  if (!amount || !usdPrice) {
    return null;
  }
  return new BigNumber(amount).multipliedBy(usdPrice);
}

/** The change from `from` to `to`, in percent. */
function getPercentageChange(from: BigNumber, to: BigNumber): number {
  return to.div(from).minus(1).multipliedBy(PERCENT_MULTIPLIER).toNumber();
}

/** The change from `from` to `to` in percent, or `null` unless it is a loss. */
function getLoss(from: BigNumber, to: BigNumber): number | null {
  if (!to.gt(0)) {
    return null;
  }
  const change = getPercentageChange(from, to);
  return change < 0 ? change : null;
}

function findHighValueLoss(
  inputUsd: BigNumber,
  outputUsd: BigNumber,
  swaps: SwapResult[],
  meta: SdkMeta
): HighValueLossWarning | null {
  const priceImpact = getLoss(inputUsd, outputUsd);
  if (priceImpact === null) {
    return null;
  }

  // Whole percents, so a loss just short of a threshold does not trip it.
  const wholeImpact = Math.trunc(Number(priceImpact.toFixed(2)));
  const isHigh = HIGH_VALUE_LOSS_CRITERIA.some(
    ({ threshold, minInput }) =>
      wholeImpact <= threshold && inputUsd.gte(minInput)
  );
  if (!isHigh) {
    return null;
  }

  return {
    priceImpact,
    level: priceImpact <= HIGH_PRICE_IMPACT ? 'high' : 'low',
    inputUsd: inputUsd.toFixed(),
    outputUsd: outputUsd.toFixed(),
    totalFeeUsd: getTotalFeeUsd(swaps, meta).toFixed(),
  };
}

/**
 * The fees paid from the wallet. Each is priced from meta's token list when
 * it has the asset, and from the API's fee price otherwise. Fees taken from
 * the output are already reflected in the output amount, so they don't count.
 */
function getTotalFeeUsd(swaps: SwapResult[], meta: SdkMeta): BigNumber {
  return swaps
    .flatMap((swap) => swap.fee)
    .filter((fee) => fee.expenseType !== 'DECREASE_FROM_OUTPUT')
    .reduce((total, fee) => {
      const price = findToken(meta, fee.asset)?.usdPrice ?? fee.price ?? 0;
      return total.plus(new BigNumber(fee.amount).multipliedBy(price));
    }, new BigNumber(0));
}

/**
 * Compares the confirmed output with the one the picked quote promised. The
 * input is valued at the picked quote's price, since that is what the user
 * saw when they picked it.
 */
function findOutputChange(
  quote: SelectedQuote,
  route: ConfirmedRoute
): OutputChangeWarning | null {
  const previousSwaps = quote.swaps;
  const currentSwaps = route.result?.swaps ?? [];

  const inputUsd = toUsd(route.requestAmount, previousSwaps[0]?.from.usdPrice);
  const previousOutputUsd = toUsd(
    quote.outputAmount,
    previousSwaps[previousSwaps.length - 1]?.to.usdPrice
  );
  const currentOutputUsd = toUsd(
    route.result?.outputAmount,
    currentSwaps[currentSwaps.length - 1]?.to.usdPrice
  );
  if (!inputUsd || !previousOutputUsd || !currentOutputUsd) {
    return null;
  }

  const percentageChange = getPercentageChange(
    previousOutputUsd,
    currentOutputUsd
  );
  const isExcessive = OUTPUT_CHANGE_CRITERIA.some(
    ({ threshold, minInput }) =>
      percentageChange <= threshold && inputUsd.gte(minInput)
  );
  if (!isExcessive) {
    return null;
  }

  return {
    percentageChange,
    usdChange: currentOutputUsd.minus(previousOutputUsd).toFixed(),
  };
}

/**
 * Too little slippage and too much are exclusive: a slippage below what a
 * step recommends is never also high.
 */
function getSlippageWarnings(
  swaps: SwapResult[],
  slippage: string
): {
  insufficientSlippage: InsufficientSlippageWarning | null;
  highSlippage: HighSlippageWarning | null;
} {
  const userSlippage = parseFloat(slippage);
  const minRequiredSlippage = getMinRequiredSlippage(swaps);

  if (
    minRequiredSlippage !== null &&
    userSlippage < parseFloat(minRequiredSlippage)
  ) {
    const recommendedSlippages: Record<number, string> = {};
    swaps.forEach((swap, index) => {
      const recommended = swap.recommendedSlippage?.slippage;
      if (recommended && parseFloat(recommended) > userSlippage) {
        recommendedSlippages[index] = recommended;
      }
    });
    return {
      insufficientSlippage: { recommendedSlippages, minRequiredSlippage },
      highSlippage: null,
    };
  }

  const isHigh =
    userSlippage > HIGH_SLIPPAGE &&
    parseFloat(minRequiredSlippage ?? '0') < userSlippage;
  return {
    insufficientSlippage: null,
    highSlippage: isHigh ? { slippage } : null,
  };
}
