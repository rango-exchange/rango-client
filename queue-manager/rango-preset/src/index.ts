import { Configs, initConfig } from './configs';
import { SwapQueueDef } from './types';
import { swapQueueDef } from './queueDef';

export { PrettyError, prettifyErrorMessage } from './shared-errors';
export { SwapQueueContext, SwapStorage } from './types';
export {
  PendingSwapWithQueueID,
  getCurrentBlockchainOfOrNull,
  getRelatedWalletOrNull,
  getRelatedWallet,
  MessageSeverity,
  PendingSwapStep,
  PendingSwapNetworkStatus,
  PendingSwap,
  EventType,
  SwapProgressNotification,
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
export { useMigration, useQueueManager } from './hooks';

export function makeQueueDefinition(configs: Configs): SwapQueueDef {
  initConfig(configs);
  return swapQueueDef;
}
