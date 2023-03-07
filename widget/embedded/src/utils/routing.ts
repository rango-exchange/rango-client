import {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import { BestRouteResponse } from 'rango-sdk';
import { ZERO } from '../constants/numbers';
import { areEqual } from './common';
import { numberToString } from './numbers';
import { SelectedWallet } from './wallets';

export const getBestRouteToTokenUsdPrice = (
  bestRoute: BestRouteResponse | null,
): number | null | undefined =>
  bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to.usdPrice;

export function isNumberOfSwapsChanged(route1: BestRouteResponse, route2: BestRouteResponse) {
  const route1Swaps = route1.result?.swaps || [];
  const route2Swaps = route2.result?.swaps || [];
  return route1Swaps.length !== route2Swaps.length;
}

export function isRouteSwappersUpdated(route1: BestRouteResponse, route2: BestRouteResponse) {
  const route1Swappers = route1.result?.swaps.map((swap) => swap.swapperId) || [];
  const route2Swappers = route2.result?.swaps.map((swap) => swap.swapperId) || [];
  return areEqual(route1Swappers, route2Swappers);
}

export function isRouteInternalCoinsUpdated(route1: BestRouteResponse, route2: BestRouteResponse) {
  const route1InternalCoins = route1.result?.swaps.map((swap) => swap.to.symbol) || [];
  const route2InternalCoins = route2.result?.swaps.map((swap) => swap.to.symbol) || [];
  return areEqual(route1InternalCoins, route2InternalCoins);
}

export const isRouteChanged = (route1: BestRouteResponse, route2: BestRouteResponse): boolean => {
  return (
    isNumberOfSwapsChanged(route1, route2) ||
    isRouteSwappersUpdated(route1, route2) ||
    isRouteInternalCoinsUpdated(route1, route2)
  );
};

export const getOutToInRatio = (fromUsdValue: BigNumber | null, toUsdValue: BigNumber | null) =>
  fromUsdValue === null || fromUsdValue.lte(ZERO)
    ? 0
    : toUsdValue === null || toUsdValue.lte(ZERO)
    ? 0
    : toUsdValue.div(fromUsdValue).minus(1).multipliedBy(100);

export const outToRatioHasWarning = (fromUsdValue: BigNumber | null, outToInRatio: BigNumber | 0) =>
  (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
    (fromUsdValue === null || fromUsdValue.gte(new BigNumber(200)))) ||
  (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
    (fromUsdValue === null || fromUsdValue.gte(new BigNumber(1000))));

export const getRequiredBalanceOfWallet = (
  selectedWallet: SelectedWallet,
  fee: SimulationValidationStatus[] | null,
): SimulationAssetAndAmount[] | null => {
  if (fee === null) return null;
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === selectedWallet.chain)
    ?.wallets.find(
      (wallet) => wallet.address?.toLowerCase() === selectedWallet.address.toLowerCase(),
    );
  if (!relatedFeeStatus) return null;
  return relatedFeeStatus.requiredAssets;
};
