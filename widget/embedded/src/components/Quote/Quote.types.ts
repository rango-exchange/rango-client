import type { QuoteError, QuoteWarning } from '../../types';
import type { Step } from '@rango-dev/ui';
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
};

export type QuoteTriggerProps = {
  quoteRef: React.MutableRefObject<HTMLButtonElement | null>;
  recommended: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  steps: Step[];
  expanded?: boolean;
};

export type QuoteTriggerImagesProps = {
  content: ReactNode;
  state?: 'error' | 'warning' | undefined;
  src: string;
  open?: boolean;
  className?: string;
};
