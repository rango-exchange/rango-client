/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Step } from '@rango-dev/ui/dist/widget/ui/src/components/BestRoute/BestRoute.types';
import type { BestRouteResponse, BlockchainMeta } from 'rango-sdk';

import {
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { getBlockchainShortNameFor } from '../../utils/meta';
import { numberToString } from '../../utils/numbers';

export function formatBestRoute(
  bestRoute: BestRouteResponse,
  blockchains: BlockchainMeta[]
): Step[] | undefined {
  return bestRoute.result?.swaps.map((swap) => {
    return {
      swapper: { displayName: swap.swapperId, image: swap.swapperLogo },
      from: {
        token: { displayName: swap.from.symbol, image: swap.from.logo },
        chain: {
          displayName:
            getBlockchainShortNameFor(swap.from.blockchain, blockchains) ?? '',
          image: swap.from.blockchainLogo,
        },
        price: {
          value: numberToString(
            swap.fromAmount,
            TOKEN_AMOUNT_MIN_DECIMALS,
            TOKEN_AMOUNT_MAX_DECIMALS
          ),
          usdValue: numberToString(
            swap.from.usdPrice?.toString(),
            USD_VALUE_MIN_DECIMALS,
            USD_VALUE_MAX_DECIMALS
          ),
        },
      },
      to: {
        token: { displayName: swap.to.symbol, image: swap.to.logo },
        chain: {
          displayName:
            getBlockchainShortNameFor(swap.to.blockchain, blockchains) ?? '',
          image: swap.to.blockchainLogo,
        },
        price: {
          value: numberToString(
            swap.toAmount,
            TOKEN_AMOUNT_MIN_DECIMALS,
            TOKEN_AMOUNT_MAX_DECIMALS
          ),
          usdValue: numberToString(
            swap.to.usdPrice?.toString(),
            USD_VALUE_MIN_DECIMALS,
            USD_VALUE_MAX_DECIMALS
          ),
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
