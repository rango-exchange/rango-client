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
    error?: string;
  };
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  label: string;
  sharpBottomStyle?: boolean;
  onClickToken: () => void;
};

type FromProps = {
  mode: 'From';
  balance?: string;
  onSelectMaxBalance: () => void;
  onInputChange: (inputAmount: string) => void;
};

type ToProps = {
  mode: 'To';
  percentageChange: string | null;
  warningLevel: PriceImpactWarningLevel;
};

export type SwapInputProps = BaseProps & (FromProps | ToProps);
