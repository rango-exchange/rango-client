import type {
  LoadingProps,
  Status,
  SwapTokenData,
} from './SwapListItem.types.js';

export interface SwapTokenProps {
  data: SwapTokenData;
  status: Status;
  tooltipContainer?: HTMLElement;
}

export type PropTypes = SwapTokenProps | LoadingProps;
