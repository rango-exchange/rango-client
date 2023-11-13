import type { ReactNode } from 'react';
import type { SwapInputProps } from 'src/containers/SwapInput/SwapInput.types';

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
  state?: 'error' | 'warning';
};

export type StepDetailsProps = {
  step: Step;
  hasSeparator: boolean;
  type: 'quote-details' | 'swap-progress';
  state?: 'default' | 'in-progress' | 'completed' | 'warning' | 'error';
  isFocused?: boolean;
  tabIndex?: number;
};
