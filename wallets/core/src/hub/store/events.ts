export type NamespaceDisconnectedEvent = {
  type: 'namespace_disconnected';
  provider: string;
  namespace: string;
};

export type NamespaceConnectedEvent = {
  type: 'namespace_connected';
  provider: string;
  namespace: string;
  accounts: string[];
};

export type NamespaceSwitchedAccountEvent = {
  type: 'namespace_account_switched';
  provider: string;
  namespace: string;
  accounts: string[];
  previousAccounts: string[];
};

export type NamespaceSwitchedNetworkEvent = {
  type: 'namespace_network_switched';
  provider: string;
  namespace: string;
  network: string;
  previousNetwork: string | null;
};

export type ProviderDetectedEvent = {
  type: 'provider_detected';
  provider: string;
};

export type ProviderConnectingEvent = {
  type: 'provider_connecting';
  provider: string;
  value: boolean;
};

export type ProviderConnectedEvent = {
  type: 'provider_connected';
  provider: string;
};

export type ProviderDisconnectedEvent = {
  type: 'provider_disconnected';
  provider: string;
};

export type Event =
  | NamespaceDisconnectedEvent
  | NamespaceConnectedEvent
  | NamespaceSwitchedAccountEvent
  | NamespaceSwitchedNetworkEvent
  | ProviderDetectedEvent
  | ProviderConnectingEvent
  | ProviderConnectedEvent
  | ProviderDisconnectedEvent;

/**
 *
 * Keeping an array of Event and when iterates over its values, it will be removed (consume) from the array.
 *
 */
export class ConsumableEvents {
  #data: Event[] = [];

  push(val: Event) {
    this.#data.push(val);
  }

  [Symbol.iterator](): Iterator<Event> {
    return {
      next: (): IteratorResult<Event> => {
        if (this.#data.length == 0) {
          return { done: true, value: undefined };
        }

        // Typescript can not narrow the type, but we have a runtime check to ensure it will never be an empty list
        const value = this.#data.shift()!;
        return {
          done: false,
          value,
        };
      },
    };
  }
}
