import type { WidgetProps } from './containers/Widget';
import type { ConnectedWallet } from './store/wallets';
import type {
  BlockchainAndTokenConfig,
  QuoteEventData,
  Tokens,
  WalletEventData,
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
  WidgetTheme,
  WidgetVariant,
} from './types';
import type {
  PendingSwapWithQueueID,
  Route,
  RouteEvent,
  RouteEventData,
  RouteExecutionEvents,
  RouteFailedEvent,
  RouteStartedEvent,
  RouteSucceededEvent,
  Step,
  StepApprovalTxSucceededEvent,
  StepCheckStatusEvent,
  StepEvent,
  StepEventData,
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
  EventSeverity,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
} from '@rango-dev/queue-manager-rango-preset';
import {
  readAccountAddress,
  useWallets,
  Events as WalletEvents,
} from '@rango-dev/wallets-react';
import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { PendingSwapNetworkStatus } from 'rango-types';

import { WIDGET_UI_ID as UI_ID } from './constants';
import { SUPPORTED_FONTS } from './constants/fonts';
import { WidgetWallets } from './containers/Wallets';
import { Widget } from './containers/Widget';
import { useWidget } from './containers/WidgetInfo';
import { WidgetProvider } from './containers/WidgetProvider';
import { useWidgetEvents } from './hooks/useWidgetEvents';
import { widgetEventEmitter } from './services/eventEmitter';
import {
  WidgetEvents as MainEvents,
  QuoteEventTypes,
  WalletEventTypes,
  WidgetEvents,
} from './types';
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
  RouteEventData,
  StepEvent,
  StepEventData,
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
  Tokens,
  WidgetVariant,
  WalletEventData,
  QuoteEventData,
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
  /**
   * @deprecated Use `widgetEventEmitter` instead. This hook will be removed in future versions.
   */
  useWidgetEvents,
  customizedThemeTokens,
  widgetEventEmitter,
  WidgetEvents,
  /**
   * @deprecated Use `WidgetEvents` instead. This enum will be removed in future versions.
   */
  MainEvents,
  QuoteEventTypes,
  WalletEventTypes,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
  UI_ID,
  SUPPORTED_FONTS,
};

// Internal type exports for Rango
export type {
  WalletState,
  WalletInfo,
  PendingSwap,
  PendingSwapWithQueueID,
  PendingSwapStep,
  RouteExecutionEvents,
};

// Internal function and enum exports for Rango
export {
  readAccountAddress,
  Networks,
  WalletEvents,
  WalletTypes,
  PendingSwapNetworkStatus,
  EventSeverity,
};
