import type { SelectedQuote } from './quote';
import type { Wallet } from './wallets';
import type {
  RouteEventData,
  StepEventData,
} from '@rango-dev/queue-manager-rango-preset';

type EventData<
  T extends QuoteEventTypes | WalletEventTypes | UiEventTypes,
  U extends Record<string, unknown> | null
> = { type: T; payload: U };

export type PreventableEventPayload<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  preventDefault: () => void;
} & T;

type Account = Wallet;

export enum QuoteEventTypes {
  QUOTE_INPUT_UPDATE = 'quoteInputUpdate',
  QUOTE_OUTPUT_UPDATE = 'quoteOutputUpdate',
  /** A route/quote request was made with a valid source, destination and amount. */
  ROUTE_REQUESTED = 'routeRequested',
  /** The route API returned zero results for the requested pair. */
  ROUTE_NOT_FOUND = 'routeNotFound',
  /** The route API returned a 4xx/5xx error. */
  ROUTE_FETCH_FAILED = 'routeFetchFailed',
  /** The user overrode the auto-selected route. */
  ROUTE_CHANGED = 'routeChanged',
}

export enum WalletEventTypes {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  /** The user opened the wallet connection modal/flow. */
  CONNECT_INITIATED = 'connectInitiated',
  /** A wallet provider was detected on app load (one per detected wallet). */
  DETECTED = 'detected',
}

/** Where in the UI a wallet connection was triggered. */
export type WalletConnectionSource = 'nav' | 'swap_button' | 'confirm_modal';

/**
 * We use a prefix for interaction type and a name for defining the event name: INTERACTION_EVENT_NAME
 * e.g. CLICK_X_BUTTON or NAVIGATE_WALLET_PAGE
 */
export enum UiEventTypes {
  CLICK_CONNECT_WALLET = 'clickConnectWallet',
  TOKEN_SELECTED = 'tokenSelected',
  CHAIN_FILTER_APPLIED = 'chainFilterApplied',
  SETTINGS_CHANGED = 'settingsChanged',
  ROUTE_FEE_VIEWED = 'routeFeeViewed',
  DESTINATION_ADDRESS_SET = 'destinationAddressSet',
  GAS_WARNING_SHOWN = 'gasWarningShown',
  GAS_WARNING_BYPASSED = 'gasWarningBypassed',
  SWAP_INITIATED = 'swapInitiated',
  SWAP_WALLETS_MODAL_SHOWN = 'swapWalletsModalShown',
  SWAP_WALLETS_CONFIRMED = 'swapWalletsConfirmed',
  SWAP_STARTED = 'swapStarted',
  SWAP_RESUMED = 'swapResumed',
  SWAP_RETRIED = 'swapRetried',
  SWAP_CANCELLED = 'swapCancelled',
}

export type QuoteInputUpdateEventPayload = {
  fromBlockchain?: string;
  toBlockchain?: string;
  fromToken?: { symbol: string; name: string | null; address: string | null };
  toToken?: { symbol: string; name: string | null; address: string | null };
  requestAmount?: string;
};

export type QuoteUpdateEventPayload = Pick<
  SelectedQuote,
  'requestAmount' | 'swaps' | 'outputAmount' | 'resultType' | 'tags'
> | null;

export type ConnectWalletEventPayload = {
  walletType: string;
  accounts: Account[];
  /** Blockchain of the first connected account. */
  chain: string | null;
  /** wallet type (e.g. "metamask"). */
  walletName: string;
  /** Where in the UI the connection was triggered, when known. */
  source: WalletConnectionSource | null;
};

export type DisconnectWalletEventPayload = {
  walletType: string;
};

export type ConnectInitiatedWalletEventPayload = {
  /** Where in the UI the connection flow was opened, when known. */
  source: WalletConnectionSource | null;
};

export type WalletDetectedEventPayload = {
  walletType: string;
  walletName: string;
};

export type ClickConnectWalletPayload = PreventableEventPayload;

/** Shared shape describing a route/quote, used by several swap events. */
export type SwapEstimateEventPayload = {
  sourceChain: string;
  destinationChain: string;
  sourceToken: string;
  destinationToken: string;
  inputAmountUsd: number | null;
  outputAmountUsd: number | null;
  sourceTokenAmount: number | null;
  destinationTokenAmount: number | null;
  routeId: string;
};

export type RouteRequestedEventPayload = SwapEstimateEventPayload & {
  routeCount: number;
};

export type RouteNotFoundEventPayload = {
  sourceChain: string;
  destinationChain: string;
  sourceToken: string;
  destinationToken: string;
  inputAmountUsd: number | null;
};

export type RouteFetchFailedEventPayload = {
  sourceChain: string;
  destinationChain: string;
  /** HTTP status code returned by the route API, as a string. */
  errorCode: string;
};

export type RouteChangedEventPayload = {
  sourceChain: string;
  destinationChain: string;
  fromRouteId: string;
  toRouteId: string;
};

export type TokenSelectedEventPayload = {
  side: 'from' | 'to';
  tokenName: string | null;
  tokenSymbol: string;
  tokenAddress: string | null;
  chain: string;
  selectionMethod: 'search' | 'popular' | 'recent';
  /** `all` when no chain filter is active, otherwise the filtered chain name. */
  activeChainFilter: string;
};

export type ChainFilterAppliedEventPayload = {
  side: 'from' | 'to';
  chain: string;
  filterSource: 'featured' | 'expanded';
};

export type SettingsChangedEventPayload = {
  settingName: 'slippage' | 'bridge_exclusion' | 'infinite_approval';
  previousValue: string;
  newValue: string;
};

export type RouteFeeViewedEventPayload = { routeId: string };

export type DestinationAddressSetEventPayload = { destinationChain: string };

export type GasWarningEventPayload = { routeId: string };

export type SwapInitiatedEventPayload = SwapEstimateEventPayload & {
  walletConnected: boolean;
};

export type SwapStartedEventPayload = SwapEstimateEventPayload & {
  stepCount: number;
};

export type SwapWalletsModalShownEventPayload = {
  chainsRequired: number;
  chainsPending: number;
};

export type SwapWalletsConfirmedEventPayload = { routeId: string };

export type SwapResumedEventPayload = {
  routeId: string;
  stepCount: number;
  stepNumber: number;
};

export type SwapRetriedEventPayload = { routeId: string };

export type SwapCancelledEventPayload = { routeId: string };

export type QuoteEventData =
  | EventData<QuoteEventTypes.QUOTE_INPUT_UPDATE, QuoteInputUpdateEventPayload>
  | EventData<QuoteEventTypes.QUOTE_OUTPUT_UPDATE, QuoteUpdateEventPayload>
  | EventData<QuoteEventTypes.ROUTE_REQUESTED, RouteRequestedEventPayload>
  | EventData<QuoteEventTypes.ROUTE_NOT_FOUND, RouteNotFoundEventPayload>
  | EventData<QuoteEventTypes.ROUTE_FETCH_FAILED, RouteFetchFailedEventPayload>
  | EventData<QuoteEventTypes.ROUTE_CHANGED, RouteChangedEventPayload>;

export type WalletEventData =
  | EventData<WalletEventTypes.CONNECT, ConnectWalletEventPayload>
  | EventData<WalletEventTypes.DISCONNECT, DisconnectWalletEventPayload>
  | EventData<
      WalletEventTypes.CONNECT_INITIATED,
      ConnectInitiatedWalletEventPayload
    >
  | EventData<WalletEventTypes.DETECTED, WalletDetectedEventPayload>;

export type UiEventData =
  | EventData<UiEventTypes.CLICK_CONNECT_WALLET, ClickConnectWalletPayload>
  | EventData<UiEventTypes.TOKEN_SELECTED, TokenSelectedEventPayload>
  | EventData<UiEventTypes.CHAIN_FILTER_APPLIED, ChainFilterAppliedEventPayload>
  | EventData<UiEventTypes.SETTINGS_CHANGED, SettingsChangedEventPayload>
  | EventData<UiEventTypes.ROUTE_FEE_VIEWED, RouteFeeViewedEventPayload>
  | EventData<
      UiEventTypes.DESTINATION_ADDRESS_SET,
      DestinationAddressSetEventPayload
    >
  | EventData<UiEventTypes.GAS_WARNING_SHOWN, GasWarningEventPayload>
  | EventData<UiEventTypes.GAS_WARNING_BYPASSED, GasWarningEventPayload>
  | EventData<UiEventTypes.SWAP_INITIATED, SwapInitiatedEventPayload>
  | EventData<
      UiEventTypes.SWAP_WALLETS_MODAL_SHOWN,
      SwapWalletsModalShownEventPayload
    >
  | EventData<
      UiEventTypes.SWAP_WALLETS_CONFIRMED,
      SwapWalletsConfirmedEventPayload
    >
  | EventData<UiEventTypes.SWAP_STARTED, SwapStartedEventPayload>
  | EventData<UiEventTypes.SWAP_RESUMED, SwapResumedEventPayload>
  | EventData<UiEventTypes.SWAP_RETRIED, SwapRetriedEventPayload>
  | EventData<UiEventTypes.SWAP_CANCELLED, SwapCancelledEventPayload>;

/**
 * RouteEvent/StepEvent must match the queue-manager's `WidgetEvents` string
 * values (`QueueManagerEvents`) so events route correctly. They're inlined as
 * literals rather than referencing the other enum to keep this a pure string
 * enum (a cross-enum reference makes `no-mixed-enums` read them as numeric).
 */
export enum WidgetEvents {
  RouteEvent = 'routeEvent',
  StepEvent = 'stepEvent',
  QuoteEvent = 'quoteEvent',
  WalletEvent = 'walletEvent',
  UiEvent = 'uiEvent',
}

export type Events = {
  [WidgetEvents.RouteEvent]: RouteEventData;
  [WidgetEvents.StepEvent]: StepEventData;
  [WidgetEvents.QuoteEvent]: QuoteEventData;
  [WidgetEvents.WalletEvent]: WalletEventData;
  [WidgetEvents.UiEvent]: UiEventData;
};

declare type EventHandler<T = unknown> = (event: T) => void;

export type WidgetEventEmitter = {
  on<Key extends WidgetEvents>(
    type: Key,
    handler: EventHandler<Events[Key]>
  ): void;
  off<Key extends WidgetEvents>(
    type: Key,
    handler?: EventHandler<Events[Key]>
  ): void;
};
