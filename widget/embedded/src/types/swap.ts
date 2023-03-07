import { SwapSavedSettings } from '@rango-dev/ui/dist/types/swaps';

export type PendingSwapSettings = Omit<
  SwapSavedSettings,
  'disabledSwappersIds'
>;
