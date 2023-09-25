/* eslint-disable @typescript-eslint/prefer-enum-initializers */
import type { SwapSavedSettings } from 'rango-types/lib';

export type PendingSwapSettings = Omit<
  SwapSavedSettings,
  'disabledSwappersIds'
>;

export enum ButtonState {
  WAIT_FOR_CONNECTING,
  SWAP,
  NEED_TO_CONFIRM,
  WARNING,
}

export type SwapButtonState = (
  | { disabled: true }
  | { disabled: false; hasWarning?: boolean }
) & {
  title: string;
  state: ButtonState;
};

export type ConvertedToken = {
  symbol: string;
  address: string | null;
  blockchain: string;
  outputAmount: string | null;
} | null;
