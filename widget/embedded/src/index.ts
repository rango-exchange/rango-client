import type { WidgetProps } from './containers/Widget';
import type { ConnectedWallet } from './store/slices/wallets';
import type {
  BlockchainAndTokenConfig,
  QuoteEventData,
  Tokens,
  UiEventData,
  WalletEventData,
  WalletInfoWithExtra,
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
} from '@arlert-dev/queue-manager-rango-preset';
import type {
  LegacyEventHandler as HandleWalletsUpdate,
  LegacyProviderInterface as ProviderInterface,
} from '@arlert-dev/wallets-core/legacy';
import type {
  WalletInfo,
  WalletState,
  WalletType,
} from '@arlert-dev/wallets-shared';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import {
  EventSeverity,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
} from '@arlert-dev/queue-manager-rango-preset';
import { legacyReadAccountAddress as readAccountAddress } from '@arlert-dev/wallets-core/legacy';
import { useWallets, Events as WalletEvents } from '@arlert-dev/wallets-react';
import { Networks, WalletTypes } from '@arlert-dev/wallets-shared';
import { PendingSwapNetworkStatus } from 'rango-types';

import {
  isOnDerivationPath,
  isOnDetached,
  isOnNamespace,
} from './components/StatefulConnectModal';
import {
  DerivationPath,
  Detached,
  Namespaces,
} from './components/WalletStatefulConnect';
import { WIDGET_UI_ID as UI_ID } from './constants';
import { SUPPORTED_FONTS } from './constants/fonts';
import { WidgetWallets } from './containers/Wallets';
import { Widget } from './containers/Widget';
import { useWidget } from './containers/WidgetInfo';
import { WidgetProvider } from './containers/WidgetProvider';
import { useStatefulConnect } from './hooks/useStatefulConnect';
import { useWalletList } from './hooks/useWalletList';
import { useWidgetEvents } from './hooks/useWidgetEvents';
import { widgetEventEmitter } from './services/eventEmitter';
import {
  WidgetEvents as MainEvents,
  QuoteEventTypes,
  UiEventTypes,
  WalletEventTypes,
  WidgetEvents,
} from './types';
import { customizedThemeTokens } from './utils/ui';

export const StatefulConnect = {
  DerivationPath,
  Namespaces,
  Detached,
  isOnDerivationPath,
  isOnNamespace,
  isOnDetached,
};

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
  UiEventData,
  WalletInfoWithExtra,
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
  useStatefulConnect,
  /**
   * @deprecated Use `widgetEventEmitter` instead. This hook will be removed in future versions.
   */
  useWidgetEvents,
  useWalletList,
  customizedThemeTokens,
  widgetEventEmitter,
  WidgetEvents,
  /**
   * @deprecated Use `WidgetEvents` instead. This enum will be removed in future versions.
   */
  MainEvents,
  QuoteEventTypes,
  WalletEventTypes,
  UiEventTypes,
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
