import type { QuoteError, QuoteWarning } from '../../types';
import type { BestRouteResponse } from 'rango-sdk';
import type { ReactNode } from 'react';

export type QuoteProps = {
  type: 'basic' | 'list-item' | 'swap-preview';
  error: QuoteError | null;
  warning: QuoteWarning | null;
  recommended: boolean;
  tag?: ReactNode;
  quote: BestRouteResponse;
  input: { value: string; usdValue: string };
  output: { value: string; usdValue?: string };
  expanded?: boolean;
  tooltipContainer?: HTMLElement;
};
