import type { TooltipPropTypes } from '../Tooltip/Tooltip.types.js';
import type { TypographyPropTypes } from '../Typography/index.js';

export type PriceImpactWarningLevel = 'low' | 'high' | undefined;

export type PriceImpactPropTypes = {
  size: TypographyPropTypes['size'];
  outputUsdValue?: string;
  outputColor?: string;
  realOutputUsdValue?: string;
  error?: string;
  percentageChange?: string | null;
  warningLevel?: PriceImpactWarningLevel;
  style?: React.CSSProperties;
  className?: string;
  tooltipProps?: {
    container?: TooltipPropTypes['container'];
    side?: TooltipPropTypes['side'];
  };
};
