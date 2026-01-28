import type { PriceImpactWarningLevel } from '../../components/PriceImpact/PriceImpact.types.js';
import type { ReactElement } from 'react';

export type BaseProps = {
  id: string;
  chain: {
    displayName: string;
    image?: string;
  };
  token: {
    displayName: string;
    image?: string;
    securityWarning?: boolean;
  };
  price: {
    value: string;
    usdValue?: string;
    realValue?: string;
    realUsdValue?: string;
    error?: string;
  };
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  label?: string | ReactElement;
  sharpBottomStyle?: boolean;
  onClickToken: () => void;
  tooltipContainer?: HTMLElement;
  selectionType?: 'token' | 'chain';
};

type FromProps = {
  mode: 'From';
  onInputChange: (inputAmount: string) => void;
  onInputBlur?: (inputAmount: string) => void;
};

type ToProps = {
  mode: 'To';
  fetchingQuote?: boolean;
  percentageChange: string | null;
  warningLevel: PriceImpactWarningLevel;
};

export type SwapInputPropTypes = BaseProps &
  (FromProps | ToProps) & {
    tooltipContainer?: HTMLElement;
    moreInfo?: ReactElement;
  };
