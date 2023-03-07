import { SwapSavedSettings } from '@rangodev/ui/dist/types/swaps';

export type PendingSwapSettings = Omit<SwapSavedSettings, 'disabledSwappersIds'>;
