import { SwapSavedSettings } from '@rango-dev/ui/dist/types/swaps';

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
