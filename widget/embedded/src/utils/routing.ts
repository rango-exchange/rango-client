import {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import { BestRouteResponse } from 'rango-sdk';
import { ZERO } from '../constants/numbers';
import { numberToString } from './numbers';
import { SelectedWallet } from './wallets';

export const getBestRouteToTokenUsdPrice = (
  bestRoute: BestRouteResponse | null,
): number | null | undefined =>
  bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to.usdPrice;

export type RouteChangeStatus = {
  isChanged: boolean;
  warningMessage?: string;
};

export const compareRoutes = (
  route1: BestRouteResponse,
  route2: BestRouteResponse,
  inputAmount: string,
  fromTokenUsdPrice: number | null,
  toTokenUsdPrice: number | null,
): RouteChangeStatus => {
  let outUsdValue: BigNumber = (
    new BigNumber(route2.result?.outputAmount || '0') || ZERO
  ).multipliedBy(toTokenUsdPrice || 0);
  if (outUsdValue.isNaN()) outUsdValue = ZERO;
  let inUsdValue: BigNumber = new BigNumber(inputAmount || '0').multipliedBy(
    fromTokenUsdPrice || 0,
  );
  if (inUsdValue.isNaN()) inUsdValue = ZERO;
  const outToInRatio =
    inUsdValue === null || inUsdValue.lte(ZERO)
      ? 0
      : outUsdValue === null || outUsdValue.lte(ZERO)
      ? 0
      : outUsdValue.div(inUsdValue).minus(1).multipliedBy(100);
  const disableSwapButton =
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (inUsdValue === null || inUsdValue.gte(new BigNumber(400)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (inUsdValue === null || inUsdValue.gte(new BigNumber(1000))));

  if (disableSwapButton) {
    return {
      isChanged: true,
      warningMessage: 'Route updated and price impact is too high, try again later!',
    };
  }

  const out1 = route1.result?.outputAmount || null;
  const out2 = route2.result?.outputAmount || null;
  if (!!out1 && !!out2) {
    const changePercent = new BigNumber(out2).div(new BigNumber(out1)).minus(1).multipliedBy(100);
    if (changePercent.toNumber() <= -1) {
      return {
        isChanged: true,
        warningMessage: `Output amount changed to ${numberToString(out2)} 
      (${numberToString(changePercent, null, 2)}% change).`,
      };
    }
  }
  const route1Swaps = route1.result?.swaps || [];
  const route2Swaps = route2.result?.swaps || [];
  if (route1Swaps.length !== route2Swaps.length)
    return { isChanged: true, warningMessage: 'Route has been updated.' };
  else {
    for (let i = 0; i < route1Swaps.length; i++) {
      if (route1Swaps[i].swapperId !== route2Swaps[i].swapperId)
        return { isChanged: true, warningMessage: 'Route swappers has been updated.' };
      else if (route1Swaps[i].to.symbol !== route2Swaps[i].to.symbol)
        return {
          isChanged: true,
          warningMessage: 'Route internal coins has been updated.',
        };
    }
  }
  return { isChanged: false };
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
  wallet: SelectedWallet,
  fee: SimulationValidationStatus[] | null,
): SimulationAssetAndAmount[] | null => {
  if (fee === null) return null;
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === wallet.chain)
    ?.wallets.find((it) => it.address?.toLowerCase() === wallet.address.toLowerCase());
  if (!relatedFeeStatus) return null;
  return relatedFeeStatus.requiredAssets;
};
