import type { PendingSwap } from 'rango-types';

export type GroupBy = (list: PendingSwap[]) => {
  title: string;
  swaps: PendingSwap[];
}[];

export interface PropTypes {
  list: PendingSwap[];
  onBack: () => void;
  onSwapClick: (requestId: string) => void;
  groupBy?: GroupBy;
}
