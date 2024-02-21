import type { PropTypes as TooltipPropTypes } from '../Tooltip/Tooltip.types';
import type { TypographyPropTypes } from '../Typography';

export type PriceImpactWarningLevel = 'low' | 'high' | undefined;

export type PriceImpactProps = {
  size: TypographyPropTypes['size'];
  outputUsdValue?: string;
  realOutputUsdValue?: string;
  error?: string;
  percentageChange?: string | null;
  warningLevel?: PriceImpactWarningLevel;
  tooltipProps?: {
    container?: TooltipPropTypes['container'];
    side?: TooltipPropTypes['side'];
  };
};
