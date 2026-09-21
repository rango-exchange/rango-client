import type { BalanceShortfall, SelectedWallet } from './types';
import type { BlockchainValidationStatus, SwapResult } from 'rango-sdk';

import { getRouteChains } from './chains';

/**
 * The assets the API says the user is short of, per selected wallet. Wallets on
 * chains the route needs a signature on come first, in route order, so the
 * first shortfall is the one that would stop the earliest step.
 */
export function getBalanceShortfalls(params: {
  swaps: SwapResult[];
  validationStatus: BlockchainValidationStatus[] | null;
  selectedWallets: SelectedWallet[];
}): BalanceShortfall[] {
  const { swaps, validationStatus, selectedWallets } = params;
  if (!validationStatus) {
    return [];
  }

  const requiredChains = getRouteChains(swaps, 'required');
  const rank = (chain: string) => {
    const index = requiredChains.indexOf(chain);
    return index === -1 ? requiredChains.length : index;
  };

  return [...selectedWallets]
    .sort((a, b) => rank(a.chain) - rank(b.chain))
    .flatMap((wallet) => {
      const status = validationStatus
        .find((item) => item.blockchain === wallet.chain)
        ?.wallets.find(
          (item) => item.address?.toLowerCase() === wallet.address.toLowerCase()
        );

      return (status?.requiredAssets ?? [])
        .filter((asset) => !asset.ok)
        .map((asset) => ({
          ...asset,
          chain: wallet.chain,
          address: wallet.address,
        }));
    });
}
