import type { PriceImpactWarningLevel } from '../../components/PriceImpact/PriceImpact.types.js';

export type BaseProps = {
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
  anyWalletConnected: boolean;
};

type ToProps = {
  mode: 'To';
  fetchingQuote?: boolean;
  percentageChange: string | null;
  warningLevel: PriceImpactWarningLevel;
};

export type SwapInputPropTypes = BaseProps &
  (FromProps | ToProps) & { tooltipContainer?: HTMLElement };
