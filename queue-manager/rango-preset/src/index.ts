import type { Configs } from './configs';
import type { SwapQueueDef } from './types';

import { initConfig } from './configs';
import { swapQueueDef } from './queueDef';

export { PrettyError, prettifyErrorMessage } from './shared-errors';
export type {
  SwapQueueContext,
  SwapStorage,
  RouteExecutionEvents,
  Route,
  Step,
  RouteEvent,
  StepEvent,
  EventSeverity,
  RouteStartedEvent,
  RouteSucceededEvent,
  RouteFailedEvent,
  StepStartedEvent,
  StepSucceededEvent,
  StepFailedEvent,
  StepTxExecutionUpdatedEvent,
  StepTxExecutionBlockedEvent,
  StepCheckStatusEvent,
  StepApprovalTxSucceededEvent,
  StepOutputRevealedEvent,
} from './types';
export {
  MainEvents,
  StepEventType,
  RouteEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
} from './types';
export type { PendingSwapWithQueueID, EventType } from './shared';
export {
  getCurrentBlockchainOfOrNull,
  getRelatedWalletOrNull,
  getRelatedWallet,
  MessageSeverity,
  calculatePendingSwap,
} from './shared';
export {
  updateSwapStatus,
  checkWaitingForNetworkChange,
  getCurrentStep,
  cancelSwap,
  getRequiredWallet,
  getRunningSwaps,
  resetRunningSwapNotifsOnPageLoad,
  isApprovalTX,
  getLastSuccessfulStep,
} from './helpers';
export { useMigration, useQueueManager, useEvents } from './hooks';

export function makeQueueDefinition(configs: Configs): SwapQueueDef {
  initConfig(configs);
  return swapQueueDef;
}
