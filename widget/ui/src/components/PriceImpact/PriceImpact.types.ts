import type { PropTypes as TooltipPropTypes } from '../Tooltip/Tooltip.types';

export type PriceImpactWarningLevel = 'low' | 'high' | undefined;

export type PriceImpactProps = {
  size: 'small' | 'large';
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
