/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Step } from '@rango-dev/ui/dist/widget/ui/src/components/BestRoute/BestRoute.types';
import type { BestRouteResponse, BlockchainMeta } from 'rango-sdk';

import { numberToString } from '../../utils/numbers';

export function formatBestRoute(
  bestRoute: BestRouteResponse
): Step[] | undefined {
  return bestRoute.result?.swaps.map((swap) => {
    return {
      swapper: { displayName: swap.swapperType, image: swap.swapperLogo },
      from: {
        token: { displayName: swap.from.symbol, image: swap.from.logo },
        chain: {
          displayName: swap.from.blockchain,
          image: swap.from.blockchainLogo,
        },
        price: {
          value: numberToString(swap.fromAmount, 6, 6),
          usdValue: numberToString(swap.from.usdPrice?.toString(), 6, 6),
        },
      },
      to: {
        token: { displayName: swap.to.symbol, image: swap.to.logo },
        chain: {
          displayName: swap.to.blockchain,
          image: swap.to.blockchainLogo,
        },
        price: {
          value: numberToString(swap.toAmount, 6, 6),
          usdValue: numberToString(swap.to.usdPrice?.toString(), 6, 6),
        },
      },
    };
  });
}

export function getRequiredWallets(route: BestRouteResponse | null): string[] {
  const wallets: string[] = [];

  route?.result?.swaps.forEach((swap) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    let lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepFromBlockchain != lastAddedWallet) {
      wallets.push(currentStepFromBlockchain);
    }
    lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepToBlockchain != lastAddedWallet) {
      wallets.push(currentStepToBlockchain);
    }
  });
  return wallets;
}

export function isValidAddress(
  chain: BlockchainMeta,
  address: string
): boolean {
  const regex = chain.addressPatterns;
  const valid = regex.filter((r) => new RegExp(r).test(address)).length > 0;
  return valid;
}
