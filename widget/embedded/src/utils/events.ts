import { eventEmitter } from '../services/eventEmitter';
import { type UiEventData, WidgetEvents } from '../types';

type UiEvent = {
  type: UiEventData['type'];
  payload?: Omit<UiEventData['payload'], 'preventDefault'>;
};

export function emitPreventableEvent(event: UiEvent, action: () => void): void {
  let defaultPrevented = false;

  const extendedPayload = {
    preventDefault() {
      defaultPrevented = true;
    },
    ...(event.payload === undefined && { payload: event.payload }),
  };

  eventEmitter.emit(WidgetEvents.UiEvent, {
    type: event.type,
    payload: extendedPayload,
  });

  if (!defaultPrevented) {
    action();
  }
}
