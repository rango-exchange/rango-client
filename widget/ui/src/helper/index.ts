import { BestRouteType } from '../types/swaps';

export const SecondsToString = (s: number): string => {
  const minutes = parseInt((s / 60).toString()).toString();
  return `${minutes}`;
};
export const TotalArrivalTime = (data: BestRouteType) =>
  data?.result?.swaps?.reduce((a, b) => a + b.estimatedTimeInSeconds, 0) || 0;

export const RawFees = (data: BestRouteType): string =>
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