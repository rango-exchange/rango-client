import type { PendingSwap } from 'rango-types';

export interface SwapDetailsProps {
  swap: PendingSwap;
  requestId: string;
  onDelete: () => void;
  onCancel: () => void;
}
export interface RequestIdProps {
  requestId: string;
}
export interface SwapDateRowProps {
  date: string;
  isFinished: boolean;
}
export interface SwapDetailsPlaceholderPropTypes {
  requestId: string;
  showSkeleton: boolean;
}
