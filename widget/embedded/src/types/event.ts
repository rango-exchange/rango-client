import type { SelectedQuote } from './quote';
import type { Wallet } from './wallets';
import type {
  RouteEventData,
  StepEventData,
} from '@rango-dev/queue-manager-rango-preset';

import { WidgetEvents as QueueManagerEvents } from '@rango-dev/queue-manager-rango-preset';

export type CustomEventPayload<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  preventDefault: () => void;
  defaultPrevented: boolean;
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

export type ClickConnectWalletPayload = CustomEventPayload;

export type QuoteEventData =
  | {
      type: QuoteEventTypes.QUOTE_INPUT_UPDATE;
      payload: QuoteInputUpdateEventPayload;
    }
  | {
      type: QuoteEventTypes.QUOTE_OUTPUT_UPDATE;
      payload: QuoteUpdateEventPayload;
    };

export type WalletEventData =
  | {
      type: WalletEventTypes.CONNECT;
      payload: ConnectWalletEventPayload;
    }
  | {
      type: WalletEventTypes.DISCONNECT;
      payload: DisconnectWalletEventPayload;
    };

export type UiEventData = {
  type: UiEventTypes.CLICK_CONNECT_WALLET;
  payload: ClickConnectWalletPayload;
};

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
