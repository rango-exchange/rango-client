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
  RouteEventData,
  StepEventData,
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
  LastConnectedWallet,
  Meta,
  AllBlockchains,
} from './types';
export {
  WidgetEvents,
  StepEventType,
  RouteEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
  EventSeverity,
} from './types';
export type {
  PendingSwapWithQueueID,
  EventType,
  TargetNamespace,
  WalletType,
} from './shared';
export {
  getCurrentNamespaceOfOrNull,
  getRelatedWalletOrNull,
  getRelatedWallet,
  MessageSeverity,
  calculatePendingSwap,
  getUsdPrice,
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
export { useMigration, useQueueManager } from './hooks';

export function makeQueueDefinition(configs: Configs): SwapQueueDef {
  initConfig(configs);
  return swapQueueDef;
}
