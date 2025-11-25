import type { SelectedQuote } from '../../types';

import { getQuoteChains } from '../../utils/wallets';

export function getRouteBlockchains(quote: SelectedQuote): string[] {
  return getQuoteChains({ quote, filter: 'required' }).filter(
    // Since the source wallet is selected on the source page, we don't include it here.
    (blockchain) => blockchain !== quote.swaps[0].from.blockchain
  );
}
