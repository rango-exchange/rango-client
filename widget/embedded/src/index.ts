import {
  WidgetTheme,
  WidgetConfig,
  WidgetColors,
  BlockchainAndTokenConfig,
} from './types';
import { WidgetProps, Widget } from './Widget';
import { WalletType } from '@rango-dev/wallets-shared';
import { WidgetWallets } from './Wallets';
import {
  useWallets,
  ProviderInterface,
  EventHandler as HandleWalletsUpdate,
} from '@rango-dev/wallets-core';
import {
  useEvents as useWidgetEvents,
  MainEvents,
  RouteEvent,
  StepEvent,
  Route,
  Step,
  RouteStartedEvent,
  RouteSucceededEvent,
  RouteFailedEvent,
  RouteEventType,
  StepStartedEvent,
  StepSucceededEvent,
  StepFailedEvent,
  StepTxExecutionUpdatedEvent,
  StepTxExecutionBlockedEvent,
  StepCheckStatusEvent,
  StepApprovalTxSucceededEvent,
  StepOutputRevealedEvent,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
} from '@rango-dev/queue-manager-rango-preset';

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  ProviderInterface,
  BlockchainAndTokenConfig,
  WidgetProps,
  RouteEvent,
  StepEvent,
  Route,
  Step,
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
  HandleWalletsUpdate,
};
export {
  Widget,
  WidgetWallets,
  useWallets,
  useWidgetEvents,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
};
