import {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';
import { areEqual } from './common';
import { SelectedWallet } from './wallets';
import { BestRouteParams } from '../types';
import { TokenMeta } from '@rango-dev/ui/dist/types/meta';
import { numberToString } from './numbers';
import { getUsdFeeOfStep } from './swap';
import { BestRouteWithFee } from '@rango-dev/ui';

export function searchParamsToToken(
  tokens: Token[],
  searchParams: string | null,
  chain: BlockchainMeta
): Token | null {
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParams?.split('--');
      if (symbolAndAddress?.length === 1)
        return (
          token.symbol === symbolAndAddress[0] &&
          token.address === null &&
          token.blockchain === chain.name
        );
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
  selectedWallet: SelectedWallet,
  fee: SimulationValidationStatus[] | null
): SimulationAssetAndAmount[] | null {
  if (fee === null) return null;
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === selectedWallet.chain)
    ?.wallets.find(
      (wallet) =>
        wallet.address?.toLowerCase() === selectedWallet.address.toLowerCase()
    );
  if (!relatedFeeStatus) return null;
  return relatedFeeStatus.requiredAssets;
}

export function isRouteParametersChanged(
  prevParams: BestRouteParams,
  currentParams: BestRouteParams
) {
  return (
    prevParams.fromChain?.name !== currentParams.fromChain?.name ||
    prevParams.toChain?.name !== currentParams.toChain?.name ||
    prevParams.fromToken?.symbol !== currentParams.fromToken?.symbol ||
    prevParams.toToken?.symbol !== currentParams.toToken?.symbol ||
    prevParams.fromToken?.blockchain !== currentParams.fromToken?.blockchain ||
    prevParams.toToken?.blockchain !== currentParams.toToken?.blockchain ||
    prevParams.fromToken?.address !== currentParams.fromToken?.address ||
    prevParams.toToken?.address !== currentParams.toToken?.address ||
    prevParams.inputAmount !== currentParams.inputAmount ||
    prevParams.slippage !== currentParams.slippage ||
    prevParams.customSlippage !== currentParams.customSlippage ||
    prevParams.disabledLiquiditySources?.length !==
      currentParams.disabledLiquiditySources?.length
  );
}

export function getBestRouteWithCalculatedFees(
  bestRoute: BestRouteResponse,
  tokens: TokenMeta[]
): BestRouteWithFee {
  const swapsWithFee = bestRoute.result.swaps.map((swap) => ({
    ...swap,
    feeInUsd: numberToString(getUsdFeeOfStep(swap, tokens), 0, 2),
  }));
  return {
    ...bestRoute,
    result: { ...bestRoute.result, swaps: swapsWithFee },
  };
}
