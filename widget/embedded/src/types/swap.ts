import type { SwapSavedSettings } from 'rango-types';

export type PendingSwapSettings = Omit<
  SwapSavedSettings,
  'disabledSwappersIds'
>;

export type SwapButtonState = {
  disabled: boolean;
  title: string;
  action: 'connect-wallet' | 'confirm-warning' | 'confirm-swap';
};

export type ConvertedToken = {
  symbol: string;
  address: string | null;
  blockchain: string;
  outputAmount: string | null;
} | null;
