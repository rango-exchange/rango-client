import { BestRouteResponse } from 'rango-sdk';
import type { TokenWithAmount } from '../components/TokenList/TokenList';
export const secondsToString = (s: number): string => {
  const minutes = parseInt((s / 60).toString()).toString();
  return `${minutes}`;
};
export const totalArrivalTime = (data: BestRouteResponse) =>
  data?.result?.swaps?.reduce((a, b) => a + b.estimatedTimeInSeconds, 0) || 0;

export const rawFees = (data: BestRouteResponse): string =>
  (
    data?.result?.swaps?.flatMap((s) =>
      s.fee.map((f) => ({ swapperId: s.swapperId, fee: f }))
    ) || []
  )
    .reduce((partialSum, a) => partialSum + parseFloat(a.fee.amount), 0)
    .toFixed(3);

export const decimalNumber = (number = '0', toFixed: number) =>
  parseFloat(number).toFixed(toFixed);

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export const sortTokensList = (
  tokenA: TokenWithAmount,
  tokenB: TokenWithAmount
): number => {
  if (Number(tokenA.balance?.usdValue) > Number(tokenB.balance?.usdValue)) {
    return -1;
  }
  if (Number(tokenB.balance?.usdValue) > Number(tokenA.balance?.usdValue)) {
    return 1;
  }
  return 0;
};
