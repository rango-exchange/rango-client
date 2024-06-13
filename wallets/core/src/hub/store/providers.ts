import type { Namespaces } from '../../namespaces/common/types.js';
import type { State as InternalProviderState } from '../provider/mod.js';
import type { StateCreator } from 'zustand';

import { produce } from 'immer';

import { guessProviderStateSelector, type State } from './mod.js';

type Browsers = 'firefox' | 'chrome' | 'edge' | 'brave' | 'homepage';
type Property<N extends string, V> = { name: N; value: V };
type DetachedInstances = Property<'detached', Namespaces[]>;
export type ProviderInfo = {
  name: string;
  icon: string;
  extensions: Partial<Record<Browsers, string>>;
  properties?: DetachedInstances[];
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
  /**
   * Provider has a limited state to itself, to be compatible with legacy, we try to produce same object as legacy
   * which includes namespace state as well.
   */
  guessNamespacesState: (id: string) => InternalProviderState;
}

export type ProviderStore = ProviderState & ProviderActions & ProviderSelectors;
type ProvidersStateCreator = StateCreator<State, [], [], ProviderStore>;

const providersStore: ProvidersStateCreator = (set, get) => ({
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
    return guessProviderStateSelector(get(), providerId);
  },
});

export { providersStore };
