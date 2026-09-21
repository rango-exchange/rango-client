import type { SwapResult } from 'rango-sdk';

/**
 * The chains a route touches, in route order. `'required'` keeps the chains
 * the user has to sign on; `'all'` adds the chains that only receive, such as
 * the one the route ends on.
 */
export function getRouteChains(
  swaps: SwapResult[],
  filter: 'all' | 'required'
): string[] {
  const chains = new Set<string>();
  const all = filter === 'all';

  swaps.forEach((swap, swapIndex) => {
    chains.add(swap.from.blockchain);

    const internalSwaps = swap.internalSwaps ?? [];
    const isLastStep = swapIndex === swaps.length - 1;
    internalSwaps.forEach((internalSwap, internalSwapIndex) => {
      const isLastInternalStep = internalSwapIndex === internalSwaps.length - 1;
      if (
        all ||
        (!isLastStep && !isLastInternalStep) ||
        (isLastStep && swap.to.blockchain !== internalSwap.from.blockchain)
      ) {
        chains.add(internalSwap.from.blockchain);
      }
      if (all) {
        chains.add(internalSwap.to.blockchain);
      }
    });

    if (all) {
      chains.add(swap.to.blockchain);
    }
  });

  return Array.from(chains);
}
