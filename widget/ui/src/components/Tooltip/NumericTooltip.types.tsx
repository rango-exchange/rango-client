import type { TooltipPropTypes } from './Tooltip.types.js';

export interface NumericTooltipPropTypes extends TooltipPropTypes {
  content: string | number | null | undefined;
  maxDecimals?: number;
}
