import { BestRouteResponse } from 'rango-sdk';

export const getBestRouteToTokenUsdPrice = (
  bestRoute: BestRouteResponse | null,
): string | null | undefined =>
  bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to.usdPrice;
