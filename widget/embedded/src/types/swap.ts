import { SwapSavedSettings } from 'rango-types';

export type PendingSwapSettings = Omit<
  SwapSavedSettings,
  'disabledSwappersIds'
>;

export type SwapButtonState = (
  | { disabled: true }
  | { disabled: false; hasWarning?: boolean }
) & {
  title: string;
};

export type ConvertedToken = {
  symbol: string;
  address: string | null;
  blockchain: string;
  outputAmount: string | null;
} | null;
