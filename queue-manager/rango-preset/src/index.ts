import { Configs, initConfig } from './configs';
import { SwapQueueDef } from './types';
import { swapQueueDef } from './queueDef';

export { PrettyError, prettifyErrorMessage } from './shared-errors';
export type { SwapQueueContext, SwapStorage } from './types';
export type {
  PendingSwapWithQueueID,
  PendingSwapStep,
  PendingSwap,
  EventType,
  SwapProgressNotification,
} from './shared';
export {
  getCurrentBlockchainOfOrNull,
  getRelatedWalletOrNull,
  getRelatedWallet,
  MessageSeverity,
  PendingSwapNetworkStatus,
  calculatePendingSwap,
} from './shared';
export {
  updateSwapStatus,
  checkWaitingForNetworkChange,
  getCurrentStep,
  getEvmProvider,
  cancelSwap,
  getRequiredWallet,
  getRunningSwaps,
  splitWalletNetwork,
  resetRunningSwapNotifsOnPageLoad,
} from './helpers';
export { useMigration, useQueueManager, useEvents } from './hooks';

export function makeQueueDefinition(configs: Configs): SwapQueueDef {
  initConfig(configs);
  return swapQueueDef;
}
