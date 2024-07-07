import type { TooltipPropTypes } from './Tooltip.types';

export interface NumericTooltipPropTypes extends TooltipPropTypes {
  content: string | number | null | undefined;
  maxDecimals?: number;
}
