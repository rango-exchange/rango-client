import type {
  LoadingProps,
  Status,
  SwapTokenData,
} from './SwapListItem.types.js';
import type { PendingSwapStep } from 'rango-types';

export interface SwapTokenProps {
  data: SwapTokenData;
  status: Status;
  tooltipContainer?: HTMLElement;
  currentStep: PendingSwapStep | null;
}

export type PropTypes = SwapTokenProps | LoadingProps;
