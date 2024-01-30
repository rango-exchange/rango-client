import type { PendingSwap } from 'rango-types';

export type GroupBy = (list: PendingSwap[]) => {
  swaps: PendingSwap[];
  groups: string[];
  groupCounts: number[];
};

export interface PropTypes {
  list: PendingSwap[];
  onSwapClick: (requestId: string) => void;
  groupBy: GroupBy;
  isLoading: boolean;
}
