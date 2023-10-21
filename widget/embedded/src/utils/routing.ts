/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { BestRouteEqualityParams, Wallet } from '../types';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';
import type { PriceImpactWarningLevel } from '@rango-dev/ui';
import type {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/widget/ui/src/types/swaps';
import type {
  Asset,
  BestRouteResponse,
  BlockchainMeta,
  Token,
} from 'rango-sdk';

import { getLastSuccessfulStep } from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';

import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  HIGHT_PRICE_IMPACT,
  LOW_PRICE_IMPACT,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../constants/routing';

import { areEqual } from './common';
import { findBlockchain, findToken } from './meta';
import { numberToString } from './numbers';

export function searchParamsToToken(
  tokens: Token[],
  searchParams: string | null,
  chain: BlockchainMeta | null
): Token | null {
  if (!chain) {
    return null;
  }
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParams?.split('--');
      if (symbolAndAddress?.length === 1) {
        return (
          token.symbol === symbolAndAddress[0] &&
          token.address === null &&
          token.blockchain === chain.name
        );
      }
      return (
        token.symbol === symbolAndAddress?.[0] &&
        token.address === symbolAndAddress?.[1] &&
        token.blockchain === chain.name
      );
    }) || null
  );
}

export function getBestRouteToTokenUsdPrice(
  bestRoute: BestRouteResponse | null
): number | null | undefined {
  return bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to
    .usdPrice;
}

export function isNumberOfSwapsChanged(
  route1: BestRouteResponse,
  route2: BestRouteResponse
) {
  const route1Swaps = route1.result?.swaps || [];
  const route2Swaps = route2.result?.swaps || [];
  return route1Swaps.length !== route2Swaps.length;
}

export function isRouteSwappersUpdated(
  route1: BestRouteResponse,
  route2: BestRouteResponse
) {
  const route1Swappers =
    route1.result?.swaps.map((swap) => swap.swapperId) || [];
  const route2Swappers =
    route2.result?.swaps.map((swap) => swap.swapperId) || [];
  return !areEqual(route1Swappers, route2Swappers);
}

export function isRouteInternalCoinsUpdated(
  route1: BestRouteResponse,
  route2: BestRouteResponse
) {
  const route1InternalCoins =
    route1.result?.swaps.map((swap) => swap.to.symbol) || [];
  const route2InternalCoins =
    route2.result?.swaps.map((swap) => swap.to.symbol) || [];
  return !areEqual(route1InternalCoins, route2InternalCoins);
}

export function isRouteChanged(
  route1: BestRouteResponse,
  route2: BestRouteResponse
): boolean {
  return (
    isNumberOfSwapsChanged(route1, route2) ||
    isRouteSwappersUpdated(route1, route2) ||
    isRouteInternalCoinsUpdated(route1, route2)
  );
}

export function outToRatioHasWarning(
  fromUsdValue: BigNumber | null,
  outToInRatio: BigNumber | 0
) {
  return (
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(200)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(1000))))
  );
}

export function getRequiredBalanceOfWallet(
  selectedWallet: Wallet,
  fee: SimulationValidationStatus[] | null
): SimulationAssetAndAmount[] | null {
  if (fee === null) {
    return null;
  }
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === selectedWallet.chain)
    ?.wallets.find(
      (wallet) =>
        wallet.address?.toLowerCase() === selectedWallet.address.toLowerCase()
    );
  if (!relatedFeeStatus) {
    return null;
  }
  return relatedFeeStatus.requiredAssets;
}

export function isRouteParametersChanged(params: BestRouteEqualityParams) {
  if (params.store === 'bestRoute') {
    const { prevState, currentState } = params;
    return (
      !!currentState.fromToken &&
      !!currentState.toToken &&
      (prevState.fromBlockchain?.name !== currentState.fromBlockchain?.name ||
        prevState.toBlockchain?.name !== currentState.toBlockchain?.name ||
        prevState.fromToken?.symbol !== currentState.fromToken?.symbol ||
        prevState.toToken?.symbol !== currentState.toToken?.symbol ||
        prevState.fromToken?.blockchain !== prevState.fromToken?.blockchain ||
        prevState.toToken?.blockchain !== currentState.toToken?.blockchain ||
        prevState.fromToken?.address !== currentState.fromToken?.address ||
        prevState.toToken?.address !== currentState.toToken?.address ||
        prevState.inputAmount !== currentState.inputAmount)
    );
  } else if (params.store === 'settings') {
    const { prevState, currentState } = params;
    return (
      prevState.slippage !== currentState.slippage ||
      prevState.customSlippage !== currentState.customSlippage ||
      prevState.disabledLiquiditySources?.length !==
        currentState.disabledLiquiditySources?.length ||
      prevState.infiniteApprove ||
      currentState.infiniteApprove
    );
  }
  return false;
}

export function getFormattedBestRoute(
  bestRoute: BestRouteResponse | null
): BestRouteResponse | null {
  if (!bestRoute) {
    return null;
  }

  const formattedSwaps = (bestRoute.result?.swaps || []).map((swap) => ({
    ...swap,
    fromAmount: numberToString(
      swap.fromAmount,
      TOKEN_AMOUNT_MIN_DECIMALS,
      TOKEN_AMOUNT_MAX_DECIMALS
    ),
    toAmount: numberToString(
      swap.toAmount,
      TOKEN_AMOUNT_MIN_DECIMALS,
      TOKEN_AMOUNT_MAX_DECIMALS
    ),
  }));

  return {
    ...bestRoute,
    ...(bestRoute.result && {
      result: { ...bestRoute.result, swaps: formattedSwaps },
    }),
  };
}

export function getFormattedPendingSwap(pendingSwap: PendingSwap): PendingSwap {
  const formattedSteps = pendingSwap.steps.map((step) => ({
    ...step,
    feeInUsd: numberToString(
      step.feeInUsd,
      GAS_FEE_MIN_DECIMALS,
      GAS_FEE_MAX_DECIMALS
    ),
    outputAmount: numberToString(
      step.outputAmount,
      TOKEN_AMOUNT_MIN_DECIMALS,
      TOKEN_AMOUNT_MAX_DECIMALS
    ),
    expectedOutputAmountHumanReadable: numberToString(
      step.expectedOutputAmountHumanReadable,
      TOKEN_AMOUNT_MIN_DECIMALS,
      TOKEN_AMOUNT_MAX_DECIMALS
    ),
  }));

  return {
    ...pendingSwap,
    inputAmount: numberToString(
      pendingSwap.inputAmount,
      TOKEN_AMOUNT_MIN_DECIMALS,
      TOKEN_AMOUNT_MAX_DECIMALS
    ),
    steps: formattedSteps,
  };
}

//todo: refactor bestRoute store and add loadingStatus
export const getBestRouteStatus = (loading: boolean, error: boolean) => {
  if (loading) {
    return 'loading';
  }
  if (error) {
    return 'failed';
  }
  return 'success';
};

export function getPriceImpactLevel(
  priceImpact: number
): PriceImpactWarningLevel {
  let warningLevel: PriceImpactWarningLevel = undefined;
  if (priceImpact <= LOW_PRICE_IMPACT && priceImpact > HIGHT_PRICE_IMPACT) {
    warningLevel = 'low';
  } else if (priceImpact <= HIGHT_PRICE_IMPACT) {
    warningLevel = 'high';
  }

  return warningLevel;
}

export function findCommonTokens<T extends Asset[], R extends Asset[]>(
  listA: T,
  listB: R
) {
  const tokenToString = (token: Asset): string =>
    `${token.symbol}-${token.blockchain}-${token.address ?? ''}`;

  const set = new Set();

  listA.forEach((token) => set.add(tokenToString(token)));

  return listB.filter((token) => set.has(tokenToString(token))) as R;
}

export function createRetryRoute(
  pendingSwap: PendingSwap,
  blockchains: BlockchainMeta[],
  tokens: Token[]
): {
  fromBlockchain: BlockchainMeta | null;
  fromToken: Token | null;
  toBlockchain: BlockchainMeta | null;
  toToken: Token | null;
  inputAmount: string;
} {
  const firstStep = pendingSwap.steps[0];
  const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
  const lastSuccessfulStep = getLastSuccessfulStep(pendingSwap.steps);

  const toToken = {
    blockchain: lastStep.toBlockchain,
    symbol: lastStep.toSymbol,
    address: lastStep.toSymbolAddress,
  };

  const fromBlockchainMeta = findBlockchain(
    lastSuccessfulStep
      ? lastSuccessfulStep.toBlockchain
      : firstStep.fromBlockchain,
    blockchains
  );
  const toBlockchainMeta = findBlockchain(lastStep.toBlockchain, blockchains);
  const fromTokenMeta = findToken(
    lastSuccessfulStep
      ? {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: lastSuccessfulStep.toSymbol,
          address: lastSuccessfulStep.toSymbolAddress,
        }
      : {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: firstStep.fromSymbol,
          address: firstStep.fromSymbolAddress,
        },
    tokens
  );
  const toTokenMeta = findToken(toToken, tokens);
  const inputAmount = lastSuccessfulStep
    ? lastSuccessfulStep.outputAmount ?? ''
    : pendingSwap.inputAmount;

  return {
    fromBlockchain: fromBlockchainMeta,
    fromToken: fromTokenMeta,
    toBlockchain: toBlockchainMeta,
    toToken: toTokenMeta,
    inputAmount,
  };
}
