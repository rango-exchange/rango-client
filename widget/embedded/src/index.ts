import type {
  BlockchainAndTokenConfig,
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
  WidgetTheme,
} from './types';
import type { WidgetProps } from './Widget';
import type {
  Route,
  RouteEvent,
  RouteFailedEvent,
  RouteStartedEvent,
  RouteSucceededEvent,
  Step,
  StepApprovalTxSucceededEvent,
  StepCheckStatusEvent,
  StepEvent,
  StepFailedEvent,
  StepOutputRevealedEvent,
  StepStartedEvent,
  StepSucceededEvent,
  StepTxExecutionBlockedEvent,
  StepTxExecutionUpdatedEvent,
} from '@rango-dev/queue-manager-rango-preset';
import type {
  EventHandler as HandleWalletsUpdate,
  ProviderInterface,
} from '@rango-dev/wallets-react';
import type { WalletType } from '@rango-dev/wallets-shared';

import {
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
  useEvents as useWidgetEvents,
} from '@rango-dev/queue-manager-rango-preset';
import { useWallets } from '@rango-dev/wallets-react';

import { WidgetWallets } from './Wallets';
import { Widget } from './Widget';

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  WidgetColorsKeys,
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
