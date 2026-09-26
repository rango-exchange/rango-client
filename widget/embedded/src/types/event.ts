import type { SelectedQuote } from './quote';
import type { Namespace } from '@hub3js/namespaces';
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
  /**
   * Fires once when a wallet becomes a **connected wallet**, i.e. when its
   * first namespace connects. Doesn't fire again for a namespace added to an
   * already connected wallet, or when a namespace's accounts arrive or change.
   */
  CONNECT = 'connect',
  /**
   * Fires once when a connected wallet disconnects, after `NAMESPACE_DISCONNECTED`
   * for each of its namespaces that was connected.
   */
  DISCONNECT = 'disconnect',
  /**
   * Fires at most once per session for each browser-injected wallet that is
   * detected. Hardware wallets, WalletConnect and TON Connect are excluded.
   */
  DETECTED = 'detected',
  /**
   * Fires when a wallet that isn't connected starts connecting, whether the
   * user started it or auto-connect did.
   */
  CONNECT_INITIATED = 'connectInitiated',
  /**
   * Fires when the widget asks a wallet to connect a namespace that isn't
   * connected yet, once for each requested namespace (including the first).
   *
   * Caveats:
   * - Auto-connect doesn't fire it.
   * - On a fresh connect, it fires before `CONNECT_INITIATED`.
   */
  NAMESPACE_CONNECT_INITIATED = 'namespaceConnectInitiated',
  /**
   * Fires when one of a wallet's namespaces connects, whether it's the
   * wallet's first namespace or one added to an already connected wallet.
   * Doesn't fire for the accounts that arrive with an account switch or an
   * in-place accounts update.
   */
  NAMESPACE_CONNECTED = 'namespaceConnected',
  /**
   * Fires when one of a wallet's namespaces disconnects. When the whole
   * wallet disconnects, this fires once for each namespace that was
   * connected, before `DISCONNECT`. Doesn't fire for an account switch.
   */
  NAMESPACE_DISCONNECTED = 'namespaceDisconnected',
  /**
   * Fires when the user switches account inside the wallet on a connected
   * namespace, i.e. its set of addresses changes. The same address on a
   * different network (e.g. an EVM chain change) isn't an account switch.
   */
  SWITCH_ACCOUNT = 'switchAccount',
  /**
   * Fires when a connected namespace moves to a different network, whether
   * the widget suggested the switch or the user changed the network inside
   * the wallet. The network a namespace gets while connecting isn't a switch.
   */
  SWITCH_NETWORK = 'switchNetwork',
  /**
   * Fires on every network suggestion: each time the swap queue asks for a
   * swap step's wallet to switch network (including wallets the user has to
   * switch by hand), and each time the user presses the switch-network button
   * in swap details. A blocked step can fire it several times. It doesn't say
   * whether the wallet itself was asked to switch.
   */
  NETWORK_SUGGESTED = 'networkSuggested',
}

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

/**
 * Fields shared by `connectInitiated`, `connect`, `disconnect`, `namespaceConnectInitiated`, `namespaceConnected`,
 * `namespaceDisconnected`, `switchAccount`, `switchNetwork` and `networkSuggested`.
 */
type WalletConnectionEventPayload = {
  /** Type of the wallet whose connection changed when the event fired. */
  walletType: string;
  /** Wallet type (e.g. "metamask") of the wallet whose connection changed when the event fired. */
  walletName: string;
};

/** Fields shared by `namespaceConnectInitiated`, `namespaceConnected`, `namespaceDisconnected`, `switchAccount`, `switchNetwork` and `networkSuggested`. */
type NamespaceConnectionEventPayload = WalletConnectionEventPayload & {
  /**
   * The namespace that started connecting, connected, disconnected, switched account or network, or had a network suggested when the event fired, as the
   * id wallets-react uses (e.g. `EVM` or `Solana`). Same id Sentry tags use.
   */
  namespace: Namespace;
};

/** Payload of `connectInitiated`, sent each time a wallet that isn't connected starts connecting. */
export type ConnectInitiatedEventPayload = WalletConnectionEventPayload;

/** Payload of `connect`, sent once each time a wallet becomes connected. */
export type ConnectWalletEventPayload = WalletConnectionEventPayload;

export type DisconnectWalletEventPayload = {
  walletType: string;
  walletName: string;
};

export type WalletDetectedEventPayload = {
  walletName: string;
};

/** Payload of `namespaceConnectInitiated`, sent for each namespace the widget asks a wallet to connect. */
export type NamespaceConnectInitiatedEventPayload =
  NamespaceConnectionEventPayload;

/** Payload of `namespaceConnected`, sent each time one of a wallet's namespaces connects. */
export type NamespaceConnectedEventPayload = NamespaceConnectionEventPayload;

/** Payload of `namespaceDisconnected`, sent each time one of a wallet's namespaces disconnects. */
export type NamespaceDisconnectedEventPayload = NamespaceConnectionEventPayload;

/** Payload of `switchAccount`, sent each time a connected namespace switches account. Carries no addresses. */
export type SwitchAccountEventPayload = NamespaceConnectionEventPayload;

/** Payload of `switchNetwork`, sent each time a connected namespace moves to a different network. */
export type SwitchNetworkEventPayload = NamespaceConnectionEventPayload & {
  /**
   * The network the namespace moved to, as a Rango blockchain name (e.g.
   * `ETH` or `POLYGON`). EVM chain ids are converted using blockchain meta;
   * a value that can't be mapped is sent unchanged.
   */
  network: string;
};

/** Payload of `networkSuggested`, sent on every network suggestion. */
export type NetworkSuggestedEventPayload = NamespaceConnectionEventPayload & {
  /**
   * The requested network, as a Rango blockchain name (e.g. `ETH` or
   * `POLYGON`). `namespace` is the namespace this network belongs to.
   */
  network: string;
};

export type ClickConnectWalletPayload = PreventableEventPayload;

/** Shared shape describing a route/quote, used by several swap events. */
export type SwapEstimateEventPayload = {
  sourceChain: string;
  destinationChain: string;
  sourceTokenSymbol: string;
  sourceTokenAddress: string | null;
  destinationTokenSymbol: string;
  destinationTokenAddress: string | null;
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
  sourceTokenSymbol: string;
  sourceTokenAddress: string | null;
  destinationTokenSymbol: string;
  destinationTokenAddress: string | null;
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
  selectionMethod: 'search' | 'default ';
  /** `all` when no chain filter is active, otherwise the filtered chain name. */
  activeChainFilter: string;
};

export type ChainFilterAppliedEventPayload = {
  side: 'from' | 'to';
  chain: string;
  filterSource: 'featured' | 'expanded';
};

export type LiquiditySourceType = 'exchanges' | 'bridges';

export type SettingsChangedEventPayload =
  | { setting: 'slippage'; previousValue: number; newValue: number }
  | { setting: 'infiniteApproval'; previousValue: boolean; newValue: boolean }
  | {
      setting: 'liquiditySource';
      sourceType: LiquiditySourceType;
      /** A single source was toggled on/off from the list. */
      changeType: 'individual';
      /** The sources whose enabled state changed, with their new state. */
      sources: { id: string; enabled: boolean }[];
    }
  | {
      setting: 'liquiditySource';
      sourceType: LiquiditySourceType;
      /** Every source was enabled or disabled at once via the header button. */
      changeType: 'selectAll' | 'deselectAll';
      /**
       * Selection state before the bulk action, so the consumer can summarise
       * it as all/some/none.
       */
      previousSelectedCount: number;
      totalCount: number;
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
  | EventData<WalletEventTypes.DETECTED, WalletDetectedEventPayload>
  | EventData<WalletEventTypes.CONNECT_INITIATED, ConnectInitiatedEventPayload>
  | EventData<
      WalletEventTypes.NAMESPACE_CONNECT_INITIATED,
      NamespaceConnectInitiatedEventPayload
    >
  | EventData<
      WalletEventTypes.NAMESPACE_CONNECTED,
      NamespaceConnectedEventPayload
    >
  | EventData<
      WalletEventTypes.NAMESPACE_DISCONNECTED,
      NamespaceDisconnectedEventPayload
    >
  | EventData<WalletEventTypes.SWITCH_ACCOUNT, SwitchAccountEventPayload>
  | EventData<WalletEventTypes.SWITCH_NETWORK, SwitchNetworkEventPayload>
  | EventData<WalletEventTypes.NETWORK_SUGGESTED, NetworkSuggestedEventPayload>;

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
