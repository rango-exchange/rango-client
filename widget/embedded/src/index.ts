import type { WidgetProps } from './containers/Widget';
import type { ConnectedWallet } from './store/wallets';
import type {
  BlockchainAndTokenConfig,
  Tokens,
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
  LegacyEventHandler as HandleWalletsUpdate,
  LegacyProviderInterface,
} from '@rango-dev/wallets-core';
import type {
  WalletInfo,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import {
  EventSeverity,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
  useEvents as useWidgetEvents,
} from '@rango-dev/queue-manager-rango-preset';
import {
  legacyReadAccountAddress as readAccountAddress,
  LegacyEvents as WalletEvents,
} from '@rango-dev/wallets-core';
import { useWallets } from '@rango-dev/wallets-react';
import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { PendingSwapNetworkStatus } from 'rango-types';

import { WIDGET_UI_ID as UI_ID } from './constants';
import { SUPPORTED_FONTS } from './constants/fonts';
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
  LegacyProviderInterface as ProviderInterface,
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
