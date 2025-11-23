/************ Namespace ************/

import type { StateCreator } from 'zustand';

import { produce } from 'immer';

import {
  ConsumableEvents,
  type NamespaceConnectedEvent,
  type NamespaceDisconnectedEvent,
  type NamespaceSwitchedAccountEvent,
  type NamespaceSwitchedNetworkEvent,
} from './events.js';
import { namespaceStateSelector, type State } from './mod.js';

// Currently, namespace doesn't has any config.
export type NamespaceConfig = object;

export interface NamespaceData {
  accounts: null | string[];
  network: null | string;
  connected: boolean;
  connecting: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectArgs: Record<string, any> | null;
}

interface NamespaceInfo {
  providerId: string;
  namespaceId: string;
}

interface NamespaceItem {
  info: NamespaceInfo;
  data: NamespaceData;
  error: unknown;
}

type NamespaceState = {
  events: InstanceType<typeof ConsumableEvents>;
  list: Record<string, NamespaceItem>;
};

interface NamespaceActions {
  addNamespace: (id: string, config: NamespaceInfo) => void;
  updateStatus: <K extends keyof NamespaceData>(
    id: string,
    key: K,
    value: NamespaceData[K]
  ) => void;

  _produceEventsWhenUpdatingStatus: <K extends keyof NamespaceData>(
    namespace: NamespaceItem,
    id: string,
    key: K,
    value: NamespaceData[K]
  ) => void;
}
interface NamespaceSelectors {
  getNamespaceData(storeId: string): NamespaceData;
}

export type NamespaceStore = NamespaceState &
  NamespaceActions &
  NamespaceSelectors;
type NamespaceStateCreator = StateCreator<State, [], [], NamespaceStore>;

const namespacesStore: NamespaceStateCreator = (set, get) => ({
  events: new ConsumableEvents(),

  list: {},
  addNamespace: (id, info) => {
    const data: NamespaceData = {
      accounts: null,
      network: null,
      connected: false,
      connecting: false,
      connectArgs: null,
    };

    const item = {
      data,
      error: '',
      info,
    };

    set(
      produce((state: State) => {
        state.namespaces.list[id] = item;
      })
    );
  },
  updateStatus: (id, key, value) => {
    const ns = get().namespaces.list[id];
    if (!ns) {
      throw new Error(`No namespace with '${id}' found.`);
    }

    get().namespaces._produceEventsWhenUpdatingStatus(ns, id, key, value);

    // Updating state
    set(
      produce((state: State) => {
        state.namespaces.list[id].data[key] = value;
      })
    );
  },
  getNamespaceData(storeId) {
    return namespaceStateSelector(get(), storeId);
  },

  _produceEventsWhenUpdatingStatus: (namespace, id, key, value) => {
    if (key === 'accounts') {
      // check for both null and empty array
      const isAccountsEmpty =
        Object.is(value, null) || (Array.isArray(value) && value.length === 0);

      if (isAccountsEmpty) {
        const currentConnectedStatus = get().namespaces.list[id].data.connected;
        if (currentConnectedStatus) {
          const event: NamespaceDisconnectedEvent = {
            type: 'namespace_disconnected',
            provider: namespace.info.providerId,
            namespace: namespace.info.namespaceId,
          };

          get().namespaces.events.push(event);
        }
        // Skip emitting disconnect event, if the `connected` is false
      } else {
        const currentAccounts = get().namespaces.list[id].data.accounts;

        if (!currentAccounts) {
          const event: NamespaceConnectedEvent = {
            type: 'namespace_connected',
            provider: namespace.info.providerId,
            namespace: namespace.info.namespaceId,
            accounts: value as string[],
          };

          get().namespaces.events.push(event);
        } else {
          const areSameAccounts =
            // Clone the object from the Zustand store, as it's immutable, to avoid errors during sorting.
            [...currentAccounts].sort().toString() ===
            (value as string[]).sort().toString();

          if (!areSameAccounts) {
            const event: NamespaceSwitchedAccountEvent = {
              type: 'namespace_account_switched',
              provider: namespace.info.providerId,
              namespace: namespace.info.namespaceId,
              previousAccounts: currentAccounts,
              accounts: value as string[],
            };

            get().namespaces.events.push(event);
          }
        }
      }
    } else if (key === 'network') {
      const currentNetwork = get().namespaces.list[id].data.network;

      const event: NamespaceSwitchedNetworkEvent = {
        type: 'namespace_network_switched',
        provider: namespace.info.providerId,
        namespace: namespace.info.namespaceId,
        network: value as string,
        previousNetwork: currentNetwork,
      };

      get().namespaces.events.push(event);
    }
  },
});

export { namespacesStore };
