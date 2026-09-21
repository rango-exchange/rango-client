import type { SwapResult } from 'rango-sdk';

/** The highest slippage any step recommends, since it has to satisfy all of them. */
export function getMinRequiredSlippage(swaps: SwapResult[]): string | null {
  return (
    swaps
      .map((swap) => swap.recommendedSlippage?.slippage)
      .filter((slippage): slippage is string => parseFloat(slippage ?? '') > 0)
      .sort((a, b) => parseFloat(b) - parseFloat(a))[0] ?? null
  );
}
