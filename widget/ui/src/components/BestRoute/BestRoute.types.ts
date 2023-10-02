import type { SwapInputProps } from '../../containers/SwapInput/SwapInput.types';
import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';
import type { ReactNode } from 'react';

type BaseStep = Pick<SwapInputProps, 'chain' | 'token' | 'price'>;

export type Step = {
  swapper: SwapInputProps['chain'];
  from: BaseStep;
  to: BaseStep;
  error?: {
    title?: string;
    description?: string;
  };
  alerts?: ReactNode;
};

export type BestRouteProps = Pick<
  PriceImpactProps,
  'percentageChange' | 'warningLevel'
> & {
  type: 'basic' | 'list-item' | 'swap-preview';
  recommended: boolean;
  tag?: ReactNode;
  input: { value: string; usdValue: string };
  output: { value: string; usdValue?: string };
  steps: Step[];
  totalFee: string;
  totalTime: string;
  expanded?: boolean;
};
