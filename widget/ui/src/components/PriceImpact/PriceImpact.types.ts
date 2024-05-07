import type { TooltipPropTypes } from '../Tooltip/Tooltip.types';
import type { TypographyPropTypes } from '../Typography';

export type PriceImpactWarningLevel = 'low' | 'high' | undefined;

export type PriceImpactPropTypes = {
  size: TypographyPropTypes['size'];
  outputUsdValue?: string;
  outputColor?: string;
  realOutputUsdValue?: string;
  error?: string;
  percentageChange?: string | null;
  warningLevel?: PriceImpactWarningLevel;
  tooltipProps?: {
    container?: TooltipPropTypes['container'];
    side?: TooltipPropTypes['side'];
  };
};
