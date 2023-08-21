export type PriceImpactWarningLevel = 'low' | 'high';

export type PropTypes = {
  size: 'small' | 'large';
  outputUsdValue?: string;
  percentageChange?: string;
  warningLevel?: PriceImpactWarningLevel;
};
