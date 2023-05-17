import {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';
import { areEqual } from './common';
import { BestRouteEqualityParams, Wallet } from '../types';
import { numberToString } from './numbers';
import { PendingSwap } from 'rango-types';

export function searchParamsToToken(
  tokens: Token[],
  searchParams: string | null,
  chain: BlockchainMeta | null
): Token | null {
  if (!chain) return null;
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
  selectedWallet: Wallet,
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

export function isRouteParametersChanged(params: BestRouteEqualityParams) {
  if (params.store === 'bestRoute') {
    const { prevState, currentState } = params;
    return (
      !!currentState.fromToken &&
      !!currentState.toToken &&
      (prevState.fromChain?.name !== currentState.fromChain?.name ||
        prevState.toChain?.name !== currentState.toChain?.name ||
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

export function getFormatedBestRoute(
  bestRoute: BestRouteResponse | null
): BestRouteResponse | null {
  if (!bestRoute) return null;

  const formatedSwaps = (bestRoute.result?.swaps || []).map((swap) => ({
    ...swap,
    fromAmount: numberToString(swap.fromAmount, 6, 6),
    toAmount: numberToString(swap.toAmount, 6, 6),
  }));

  return {
    ...bestRoute,
    ...(bestRoute.result && {
      result: { ...bestRoute.result, swaps: formatedSwaps },
    }),
  };
}

export function getFormatedPendingSwap(pendingSwap: PendingSwap): PendingSwap {
  const formatedSteps = pendingSwap.steps.map((step) => ({
    ...step,
    feeInUsd: numberToString(step.feeInUsd, 4, 4),
    outputAmount: numberToString(step.outputAmount, 6, 6),
    expectedOutputAmountHumanReadable: numberToString(
      step.expectedOutputAmountHumanReadable,
      6,
      6
    ),
  }));

  return {
    ...pendingSwap,
    inputAmount: numberToString(pendingSwap.inputAmount, 6, 6),
    steps: formatedSteps,
  };
}

//todo: refactor bestRoute store and add loadingStatus
export const getBestRouteStatus = (loading: boolean, error: boolean) => {
  if (loading) return 'loading';
  if (error) return 'failed';
  else return 'success';
};
