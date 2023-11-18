import type { WidgetProps } from './containers/Widget';
import type {
  BlockchainAndTokenConfig,
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
  WidgetTheme,
} from './types';
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

import { WidgetWallets } from './containers/Wallets';
import { Widget } from './containers/Widget';
import { useWidget } from './containers/WidgetInfo';
import { WidgetProvider } from './containers/WidgetProvider';

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
  /**
   * @deprecated Use `WidgetProvider` instead. This component will be removed in future versions.
   */
  WidgetWallets,
  WidgetProvider,
  useWidget,
  useWallets,
  useWidgetEvents,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
};
