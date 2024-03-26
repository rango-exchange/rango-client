import type { State as InternalProviderState } from './provider';
import type { StoreApi } from 'zustand/vanilla';

import { produce } from 'immer';
import { type StateCreator } from 'zustand';
import { createStore as createZustandStore } from 'zustand/vanilla';

import { guessNamespacesStateSelector } from './selectors';

// TODO: unknown means it hasn't been completed yet.

/************ Providers ************/

type Browsers = 'firefox' | 'chrome' | 'edge' | 'brave' | 'homepage';
type ProviderInfo = {
  name: string;
  icon: string;
  extensions: Partial<Record<Browsers, string>>;
};

export interface ProviderConfig {
  info: ProviderInfo;
}

interface ProviderData {
  installed: boolean;
}

type ProviderState = {
  list: Record<
    string,
    {
      config: ProviderConfig;
      data: ProviderData;
      error: unknown;
    }
  >;
};
interface ProviderActions {
  addProvider: (id: string, config: ProviderConfig) => void;
  updateStatus: <K extends keyof ProviderData>(
    id: string,
    key: K,
    value: ProviderData[K]
  ) => void;
}

interface ProviderSelectors {
  guessNamespacesState: (id: string) => InternalProviderState;
}

type ProviderStore = ProviderState & ProviderActions & ProviderSelectors;
type ProvidersStateCreator = StateCreator<State, [], [], ProviderStore>;

const providers: ProvidersStateCreator = (set, get) => ({
  list: {},
  addProvider: (id, config) => {
    const item = {
      data: {
        installed: false,
      },
      error: '',
      config,
    };

    set(
      produce((state: State) => {
        state.providers.list[id] = item;
      })
    );
  },
  updateStatus: (id, key, value) => {
    if (!get().providers.list[id]) {
      throw new Error(`No namespace namespace with '${id}' found.`);
    }

    set(
      produce((state: State) => {
        state.providers.list[id].data[key] = value;
      })
    );
  },
  guessNamespacesState: (providerId: string): InternalProviderState => {
    return guessNamespacesStateSelector(get(), providerId);
  },
});

/************ Namespace ************/

export interface NamespaceConfig {
  providerId: string;
  namespace: string;
}
export interface NamespaceData {
  accounts: null | string[];
  network: null | string;
  connected: boolean;
  connecting: boolean;
}

type NamespaceState = {
  list: Record<
    string,
    {
      config: NamespaceConfig;
      data: NamespaceData;
      error: unknown;
    }
  >;
};

interface NamespaceActions {
  addNamespace: (id: string, config: NamespaceConfig) => void;
  updateStatus: <K extends keyof NamespaceData>(
    id: string,
    key: K,
    value: NamespaceData[K]
  ) => void;
}

type NamespaceStore = NamespaceState & NamespaceActions;
type NamespaceStateCreator = StateCreator<State, [], [], NamespaceStore>;

const namespaces: NamespaceStateCreator = (set, get) => ({
  list: {},
  addNamespace: (id, config) => {
    const item = {
      data: {
        accounts: null,
        network: null,
        connected: false,
        connecting: false,
      },
      error: '',
      config,
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
});

/************ Hub ************/

type HubConfig = object;

interface HubState {
  config: HubConfig;
}

type HubStateCreator = StateCreator<State, [], [], HubState>;

const hub: HubStateCreator = () => ({
  config: {},
});

/************ State ************/

export interface State {
  hub: HubState;
  providers: ProviderStore;
  namespaces: NamespaceStore;
}

export type Store = StoreApi<State>;
export const createStore = (): Store => {
  return createZustandStore<State>((...api) => {
    return {
      hub: hub(...api),
      providers: providers(...api),
      namespaces: namespaces(...api),
    };
  });
};
