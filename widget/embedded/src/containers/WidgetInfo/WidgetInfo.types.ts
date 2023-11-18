import type { PendingSwapWithQueueID } from '@rango-dev/queue-manager-rango-preset';

export interface WidgetInfoContextInterface {
  swaps?: PendingSwapWithQueueID[];
}
