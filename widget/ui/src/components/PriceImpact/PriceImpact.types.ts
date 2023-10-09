export type PriceImpactWarningLevel = 'low' | 'high' | undefined;

export type PriceImpactProps = {
  size: 'small' | 'large';
  outputUsdValue?: string;
  error?: string;
  percentageChange?: string | null;
  warningLevel?: PriceImpactWarningLevel;
};
