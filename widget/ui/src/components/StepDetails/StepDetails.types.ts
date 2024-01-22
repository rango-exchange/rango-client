import type { SwapperType } from 'rango-sdk';
import type { ReactNode } from 'react';
import type { SwapInputProps } from 'src/containers/SwapInput/SwapInput.types';

type BaseStep = Pick<SwapInputProps, 'chain' | 'token' | 'price'>;

type SwapperInfo = SwapInputProps['chain'] & {
  type?: SwapperType;
};

export type InternalSwap = {
  swapper: SwapperInfo;
  from: {
    blockchain: string;
  };
  to: {
    blockchain: string;
  };
};

export type Step = {
  swapper: SwapperInfo;
  from: BaseStep;
  to: BaseStep;
  error?: {
    title?: string;
    description?: string;
  };
  alerts?: ReactNode;
  state?: 'error' | 'warning';
  internalSwaps?: InternalSwap[];
};

export type StepDetailsProps = {
  step: Step;
  hasSeparator: boolean;
  type: 'quote-details' | 'swap-progress';
  state?: 'default' | 'in-progress' | 'completed' | 'warning' | 'error';
  isFocused?: boolean;
  tabIndex?: number;
  tooltipContainer?: HTMLElement;
};
