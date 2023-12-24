import type { WidgetProps } from './containers/Widget';
import type { ConnectedWallet } from './store/wallets';
import type {
  BlockchainAndTokenConfig,
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
  WidgetTheme,
} from './types';
import type {
  EventSeverity,
  PendingSwapWithQueueID,
  Route,
  RouteEvent,
  RouteExecutionEvents,
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
import type {
  WalletInfo,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import {
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
  useEvents as useWidgetEvents,
} from '@rango-dev/queue-manager-rango-preset';
import {
  readAccountAddress,
  useWallets,
  Events as WalletEvents,
} from '@rango-dev/wallets-react';
import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { PendingSwapNetworkStatus } from 'rango-types';

import { WidgetWallets } from './containers/Wallets';
import { Widget } from './containers/Widget';
import { useWidget } from './containers/WidgetInfo';
import { WidgetProvider } from './containers/WidgetProvider';
import { customizedThemeTokens } from './utils/ui';

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
  ConnectedWallet,
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
  customizedThemeTokens,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
};

// Internal type exports for Rango
export type {
  WalletState,
  WalletInfo,
  PendingSwap,
  PendingSwapWithQueueID,
  PendingSwapStep,
  RouteExecutionEvents,
  EventSeverity,
};

// Internal function and enum exports for Rango
export {
  readAccountAddress,
  Networks,
  WalletEvents,
  WalletTypes,
  PendingSwapNetworkStatus,
};
