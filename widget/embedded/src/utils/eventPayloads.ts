import type { SelectedQuote, SwapEstimateEventPayload } from '../types';

import { getUsdInputFrom, getUsdOutputFrom } from './swap';

function toNumberOrNull(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Derives the shared route/quote descriptor used by several swap
 * events (swapInitiated, swapStarted, routeRequested, ...) from a quote.
 * Amounts are estimates taken from the quote, not on-chain actuals.
 */
export function buildSwapEstimatePayload(
  quote: SelectedQuote
): SwapEstimateEventPayload {
  const firstSwap = quote.swaps[0];
  const lastSwap = quote.swaps[quote.swaps.length - 1];
  const inputUsd = getUsdInputFrom(quote);
  const outputUsd = getUsdOutputFrom(quote);

  return {
    routeId: quote.requestId,
    sourceChain: firstSwap?.from.blockchain ?? '',
    destinationChain: lastSwap?.to.blockchain ?? '',
    sourceToken: firstSwap?.from.symbol ?? '',
    destinationToken: lastSwap?.to.symbol ?? '',
    sourceTokenAmount: toNumberOrNull(quote.requestAmount),
    destinationTokenAmount: toNumberOrNull(quote.outputAmount),
    inputAmountUsd: inputUsd ? inputUsd.toNumber() : null,
    outputAmountUsd: outputUsd ? outputUsd.toNumber() : null,
  };
}
