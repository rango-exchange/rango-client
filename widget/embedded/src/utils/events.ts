import { eventEmitter } from '../services/eventEmitter';
import {
  type ClickConnectWalletPayload,
  type QuoteEventData,
  type UiEventData,
  type UiEventTypes,
  type WalletDetectedEventPayload,
  WalletEventTypes,
  WidgetEvents,
} from '../types';

type PreventableUiEvent = {
  type: UiEventTypes.CLICK_CONNECT_WALLET;
  payload?: Omit<ClickConnectWalletPayload, 'preventDefault'>;
};

export function emitUiEvent(event: UiEventData): void {
  eventEmitter.emit(WidgetEvents.UiEvent, event);
}

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

  emitUiEvent({ type: event.type, payload: extendedPayload });

  if (!defaultPrevented) {
    action();
  }
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
