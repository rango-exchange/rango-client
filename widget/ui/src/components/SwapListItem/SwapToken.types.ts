import type { LoadingProps, Status, SwapTokenData } from './SwapListItem.types';

export interface SwapTokenProps {
  data: SwapTokenData;
  status: Status;
}

export type PropTypes = SwapTokenProps | LoadingProps;
