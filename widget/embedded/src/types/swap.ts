import type { SwapSavedSettings } from 'rango-types';

export type PendingSwapSettings = Omit<
  SwapSavedSettings,
  'disabledSwappersIds'
>;

export type SwapButtonState = {
  disabled: boolean;
  title: string;
  action?:
    | 'connect-wallet'
    | 'confirm-warning'
    | 'confirm-swap'
    | 'select-source-token'
    | 'select-destination-token'
    | 'select-source-wallet'
    | 'select-destination-wallet'
    | 'select-route-wallets'
    | 'show-wallet-address-error';
};

export type ConvertedToken = {
  symbol: string;
  address: string | null;
  blockchain: string;
  outputAmount: string | null;
} | null;
