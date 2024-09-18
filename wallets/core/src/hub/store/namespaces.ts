/************ Namespace ************/

import type { StateCreator } from 'zustand';

import { produce } from 'immer';

import { namespaceStateSelector, type State } from './mod.js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NamespaceConfig {
  // Currently, namespace doesn't has any config.
}

export interface NamespaceData {
  accounts: null | string[];
  network: null | string;
  connected: boolean;
  connecting: boolean;
}

interface NamespaceInfo {
  providerId: string;
  namespaceId: string;
}

type NamespaceState = {
  list: Record<
    string,
    {
      info: NamespaceInfo;
      data: NamespaceData;
      error: unknown;
    }
  >;
};

interface NamespaceActions {
  addNamespace: (id: string, config: NamespaceInfo) => void;
  updateStatus: <K extends keyof NamespaceData>(
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
  list: {},
  addNamespace: (id, info) => {
    const item = {
      data: {
        accounts: null,
        network: null,
        connected: false,
        connecting: false,
      },
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
    if (!get().namespaces.list[id]) {
      throw new Error(`No namespace with '${id}' found.`);
    }

    set(
      produce((state: State) => {
        state.namespaces.list[id].data[key] = value;
      })
    );
  },
  getNamespaceData(storeId) {
    return namespaceStateSelector(get(), storeId);
  },
});

export { namespacesStore };
