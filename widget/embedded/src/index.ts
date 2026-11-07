import type { WidgetProps } from './containers/Widget';
import type { UseStatefulConnect } from './hooks/useStatefulConnect';
import type { ConnectedWallet } from './store/slices/wallets';
import type {
  BlockchainAndTokenConfig,
  QuoteEventData,
  Tokens,
  UiEventData,
  WalletInfoWithExtra,
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
  WidgetTheme,
  WidgetVariant,
} from './types';
import type {
  ConnectResult,
  ExtendedWalletInfo,
  InstallObjects,
  NamespaceInputForConnect,
  WalletController,
  WalletControllerEventHandler,
  WalletControllerEventInfo,
  WalletState,
} from './types/walletController';
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
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import { Networks, readAccountAddress } from '@rango-dev/internal-blockchains';
import {
  EventSeverity,
  RouteEventType,
  StepEventType,
  StepExecutionBlockedEventStatus,
  StepExecutionEventStatus,
} from '@rango-dev/queue-manager-rango-preset';
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
import { Refuel } from './containers/Refuel';
import { Widget } from './containers/Widget';
import { useWidget } from './containers/WidgetInfo';
import { WidgetProvider } from './containers/WidgetProvider';
import { useStatefulConnect } from './hooks/useStatefulConnect';
import { SwapModeContext } from './hooks/useSwapMode';
import { useWidgetEvents } from './hooks/useWidgetEvents';
import { widgetEventEmitter } from './services/eventEmitter';
import {
  WidgetEvents as MainEvents,
  QuoteEventTypes,
  UiEventTypes,
  WidgetEvents,
} from './types';
import { WalletControllerEvents } from './types/walletController';
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
  WidgetTheme,
  WidgetColors,
  WidgetColorsKeys,
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
  ConnectedWallet,
  Tokens,
  WidgetVariant,
  QuoteEventData,
  UiEventData,
  WalletInfoWithExtra,
  UseStatefulConnect,
  WalletController,
  WalletControllerEventHandler,
  WalletControllerEventInfo,
  WalletState,
  ExtendedWalletInfo,
  ConnectResult,
  NamespaceInputForConnect,
  InstallObjects,
};
export {
  Widget,
  Refuel,
  SwapModeContext,
  WidgetProvider,
  useWidget,
  useStatefulConnect,
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
  UiEventTypes,
  WalletControllerEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
  UI_ID,
  SUPPORTED_FONTS,
};

// Internal type exports for Rango
export type {
  PendingSwap,
  PendingSwapWithQueueID,
  PendingSwapStep,
  RouteExecutionEvents,
};

// Internal function and enum exports for Rango
export {
  readAccountAddress,
  Networks,
  PendingSwapNetworkStatus,
  EventSeverity,
};
