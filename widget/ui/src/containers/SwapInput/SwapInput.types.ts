import type { PriceImpactWarningLevel } from '../../components/PriceImpact/PriceImpact.types';

export type BaseProps = {
  chain: {
    displayName: string;
    image: string;
  };
  token: {
    displayName: string;
    image: string;
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
  label: string;
  sharpBottomStyle?: boolean;
  onClickToken: () => void;
  tooltipContainer?: HTMLElement;
};

type FromProps = {
  mode: 'From';
  balance?: string;
  loadingBalance: boolean;
  onSelectMaxBalance: () => void;
  onInputChange: (inputAmount: string) => void;
};

type ToProps = {
  mode: 'To';
  fetchingQuote?: boolean;
  percentageChange: string | null;
  warningLevel: PriceImpactWarningLevel;
};

export type SwapInputProps = BaseProps & (FromProps | ToProps);
