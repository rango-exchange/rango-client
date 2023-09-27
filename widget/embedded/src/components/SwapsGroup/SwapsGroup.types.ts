import type { PendingSwap } from 'rango-types';

export type GroupBy = (list: PendingSwap[]) => {
  title: string;
  swaps: PendingSwap[];
}[];

export interface PropTypes {
  list: PendingSwap[];
  onSwapClick: (requestId: string) => void;
  groupBy?: GroupBy;
  isLoading: boolean;
}
