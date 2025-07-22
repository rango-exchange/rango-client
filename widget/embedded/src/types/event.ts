import type { SelectedQuote } from './quote';
import type { Wallet } from './wallets';
import type {
  RouteEventData,
  StepEventData,
} from '@arlert-dev/queue-manager-rango-preset';

import { WidgetEvents as QueueManagerEvents } from '@arlert-dev/queue-manager-rango-preset';

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
}

export enum WalletEventTypes {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

/**
 * We use a prefix for interaction type and a name for defining the event name: INTERACTION_EVENT_NAME
 * e.g. CLICK_X_BUTTON or NAVIGATE_WALLET_PAGE
 */
export enum UiEventTypes {
  CLICK_CONNECT_WALLET = 'clickConnectWallet',
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
};

export type DisconnectWalletEventPayload = {
  walletType: string;
};

export type ClickConnectWalletPayload = PreventableEventPayload;

export type QuoteEventData =
  | EventData<QuoteEventTypes.QUOTE_INPUT_UPDATE, QuoteInputUpdateEventPayload>
  | EventData<QuoteEventTypes.QUOTE_OUTPUT_UPDATE, QuoteUpdateEventPayload>;

export type WalletEventData =
  | EventData<WalletEventTypes.CONNECT, ConnectWalletEventPayload>
  | EventData<WalletEventTypes.DISCONNECT, DisconnectWalletEventPayload>;

export type UiEventData = EventData<
  UiEventTypes.CLICK_CONNECT_WALLET,
  ClickConnectWalletPayload
>;

export enum WidgetEvents {
  RouteEvent = QueueManagerEvents.RouteEvent,
  StepEvent = QueueManagerEvents.StepEvent,
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
