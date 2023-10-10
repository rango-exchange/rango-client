import type { PendingSwap } from 'rango-types';

export interface SwapDetailsProps {
  swap: PendingSwap;
  requestId: string;
  onDelete: () => void;
  onCancel: () => void;
}
export interface SwapDetailsPlaceholderPropTypes {
  requestId: string;
  showSkeleton: boolean;
}
