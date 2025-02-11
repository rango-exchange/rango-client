import type {
  Event,
  ProviderConnectedEvent,
  ProviderConnectingEvent,
  ProviderDisconnectedEvent,
} from './events.js';
import type { RawStore, State } from './store.js';

import { guessProviderStateSelector } from './selectors.js';

export interface Store extends Omit<RawStore, 'subscribe'> {
  subscribe(listener: (event: Event, state: State, prevState: State) => void): {
    flushEvents(): void;
  };
}

/**
 * Zustand's store provides a set of built-in functionalities,
 * but it may not meet all our requirements.
 * This function modifies the interface and adds or updates the available methods.
 */
export function extend(store: RawStore): Store {
  const extendedSubscribe: (store: RawStore) => Store['subscribe'] =
    (store) => (listener) => {
      const executeListener = (
        events: Event[],
        state: State,
        prevState: State
      ) => {
        for (const ev of events) {
          listener(ev, state, prevState);
        }
      };

      /*
       * only known changes will fire event for lib users
       * so all the changes in store won't trigger a user-face event
       */
      store.subscribe((state, prevState) => {
        const eventsLike = getEventsLike(state, prevState);
        const events = tryConsumeEvents(state);
        const allQueuedEvents = [...events, ...eventsLike];
        executeListener(allQueuedEvents, state, prevState);
      });

      return {
        /**
         * Manually run pending events.
         * This useful when use `subscribe` method after sometime and when store initialized.
         *
         * Note: Please consider both current and previous state will be same and we don't have access to previous state in a such scenario.
         */
        flushEvents: () => {
          const state = store.getState();
          const events = tryConsumeEvents(state);
          executeListener(events, state, state);
        },
      };
    };

  return new Proxy(store, {
    get: function (target, prop, receiver) {
      if (prop === 'subscribe') {
        return extendedSubscribe(target);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as unknown as Store;
}

/**
 * Retrieves the ConsumableEvent from the store and returns its values.
 * The values will be consumed by iterating over the field.
 */
function tryConsumeEvents(state: State): Event[] {
  return [...state.providers.events, ...state.namespaces.events];
}

/**
 * In certain cases, adding events to the store is not possible (e.g., namespace or provider layer).
 * In these cases, we observe store changes and treat specific patterns as events when detected.
 *
 * Note: This approach should be avoided in most cases. It is used here to maintain backward compatibility
 * with the provider's legacy interface.
 */
function getEventsLike(state: State, prevState: State): Event[] {
  const events: Event[] = [];

  for (const providerId of Object.keys(state.providers.list)) {
    const currentProviderState = guessProviderStateSelector(state, providerId);
    const previousProviderState = guessProviderStateSelector(
      prevState,
      providerId
    );

    if (previousProviderState.connecting !== currentProviderState.connecting) {
      const ev: ProviderConnectingEvent = {
        type: 'provider_connecting',
        provider: providerId,
        value: currentProviderState.connecting,
      };
      events.push(ev);
    }

    if (!previousProviderState.connected && currentProviderState.connected) {
      const ev: ProviderConnectedEvent = {
        type: 'provider_connected',
        provider: providerId,
      };

      events.push(ev);
    }

    if (previousProviderState.connected && !currentProviderState.connected) {
      const ev: ProviderDisconnectedEvent = {
        type: 'provider_disconnected',
        provider: providerId,
      };

      events.push(ev);
    }
  }

  return events;
}
