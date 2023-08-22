export type PriceImpactWarningLevel = 'low' | 'high';

export type PriceImpactProps = {
  size: 'small' | 'large';
  outputUsdValue?: string;
  percentageChange?: string;
  warningLevel?: PriceImpactWarningLevel;
};
