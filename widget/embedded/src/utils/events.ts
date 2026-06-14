import { eventEmitter } from '../services/eventEmitter';
import { setPendingWalletConnectionSource } from '../services/walletConnectionSource';
import {
  type ClickConnectWalletPayload,
  type QuoteEventData,
  type UiEventData,
  type UiEventTypes,
  type WalletConnectionSource,
  type WalletDetectedEventPayload,
  WalletEventTypes,
  WidgetEvents,
} from '../types';

type PreventableUiEvent = {
  type: UiEventTypes.CLICK_CONNECT_WALLET;
  payload?: Omit<ClickConnectWalletPayload, 'preventDefault'>;
};

export function emitPreventableEvent(
  event: PreventableUiEvent,
  action: () => void
): void {
  let defaultPrevented = false;

  const extendedPayload = {
    ...event.payload,
    preventDefault() {
      defaultPrevented = true;
    },
  };

  eventEmitter.emit(WidgetEvents.UiEvent, {
    type: event.type,
    payload: extendedPayload,
  });

  if (!defaultPrevented) {
    action();
  }
}

export function emitUiEvent(
  event: Exclude<UiEventData, { type: UiEventTypes.CLICK_CONNECT_WALLET }>
): void {
  eventEmitter.emit(WidgetEvents.UiEvent, event);
}

/**
 * Records the source of the wallet connection the user is about to start and
 * emits a `connectInitiated` wallet event. The recorded source is later read
 * when the wallet finishes connecting to enrich the `connect` event.
 */
export function emitWalletConnectInitiated(
  source: WalletConnectionSource | null
): void {
  setPendingWalletConnectionSource(source);
  eventEmitter.emit(WidgetEvents.WalletEvent, {
    type: WalletEventTypes.CONNECT_INITIATED,
    payload: { source },
  });
}

export function emitQuoteEvent(event: QuoteEventData): void {
  eventEmitter.emit(WidgetEvents.QuoteEvent, event);
}

export function emitWalletDetected(payload: WalletDetectedEventPayload): void {
  eventEmitter.emit(WidgetEvents.WalletEvent, {
    type: WalletEventTypes.DETECTED,
    payload,
  });
}
