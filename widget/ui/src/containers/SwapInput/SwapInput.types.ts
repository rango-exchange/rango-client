import type { PriceImpactWarningLevel } from 'src/components/PriceImpact/PriceImpact.types';

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
  sharpBottomStyle?: boolean;
  onClickToken: () => void;
};

type FromProps = {
  label: 'From';
  balance?: string;
  onSelectMaxBalance: () => void;
  onInputChange: (inputAmount: string) => void;
};

type ToProps = {
  label: 'To';
  percentageChange: string | null;
  warningLevel: PriceImpactWarningLevel;
};

type Common = {
  label: string;
};

export type SwapInputProps = BaseProps & (FromProps | ToProps | Common);
