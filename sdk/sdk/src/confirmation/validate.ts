import type {
  ConfirmedRoute,
  ConfirmQuoteIssue,
  SelectedWallet,
} from './types';
import type { SwapResult } from 'rango-sdk';

import BigNumber from 'bignumber.js';

import { RangoSdkError } from '../errors';

import { getRouteChains } from './chains';
import { getMinRequiredSlippage } from './slippage';

const ISSUE_MESSAGES: Record<ConfirmQuoteIssue['type'], string> = {
  request_canceled: 'The confirm request was canceled.',
  request_failed: 'The confirm request failed.',
  missing_wallets: 'A chain the route touches has no selected wallet.',
  no_result: 'The confirmed quote has no route to run.',
  amount_out_of_range: "The input amount is outside a step's allowed range.",
  insufficient_slippage: 'The slippage is too low for the confirmed quote.',
};

/**
 * The error `confirm` returns for an issue. The issue is its `cause`, so a
 * host can word it itself.
 */
export function toConfirmError(issue: ConfirmQuoteIssue): RangoSdkError {
  return new RangoSdkError(ISSUE_MESSAGES[issue.type], issue);
}

/**
 * The chains the route needs a wallet on that have none. With a custom
 * destination the chain the route ends on only receives, so it needs none.
 */
export function findMissingWallets(
  swaps: SwapResult[],
  selectedWallets: SelectedWallet[],
  hasDestination: boolean
): ConfirmQuoteIssue | null {
  const chains = getRouteChains(swaps, hasDestination ? 'required' : 'all');
  const missing = chains.filter(
    (chain) => !selectedWallets.some((wallet) => wallet.chain === chain)
  );
  return missing.length ? { type: 'missing_wallets', chains: missing } : null;
}

/** A confirm request can succeed while the route it returns cannot be run. */
export function findRouteIssue(
  route: ConfirmedRoute
): ConfirmQuoteIssue | null {
  const swaps = route.result?.swaps;
  if (!swaps?.length) {
    return {
      type: 'no_result',
      diagnosisMessage: route.diagnosisMessages?.[0] ?? null,
    };
  }

  const stepIndex = swaps.findIndex(isAmountOutOfRange);
  if (stepIndex !== -1) {
    const swap = swaps[stepIndex];
    return {
      type: 'amount_out_of_range',
      stepIndex,
      amount: swap.fromAmount,
      min: swap.fromAmountMinValue,
      max: swap.fromAmountMaxValue,
      restrictionType: swap.fromAmountRestrictionType,
    };
  }

  const recommendedSlippages: Record<number, string> = {};
  swaps.forEach((swap, index) => {
    if (swap.recommendedSlippage?.error) {
      recommendedSlippages[index] = swap.recommendedSlippage.slippage;
    }
  });
  if (Object.keys(recommendedSlippages).length > 0) {
    return {
      type: 'insufficient_slippage',
      recommendedSlippages,
      minRequiredSlippage: getMinRequiredSlippage(swaps),
    };
  }

  return null;
}

function isAmountOutOfRange(swap: SwapResult): boolean {
  const amount = new BigNumber(swap.fromAmount);
  const min = swap.fromAmountMinValue
    ? new BigNumber(swap.fromAmountMinValue)
    : null;
  const max = swap.fromAmountMaxValue
    ? new BigNumber(swap.fromAmountMaxValue)
    : null;

  if (swap.fromAmountRestrictionType === 'EXCLUSIVE') {
    return !!(min?.gte(amount) || max?.lte(amount));
  }
  return !!(min?.gt(amount) || max?.lt(amount));
}
