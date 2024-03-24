import type { StoreApi } from 'zustand/vanilla';

import { produce } from 'immer';
import { type StateCreator } from 'zustand';
import { createStore as createZustandStore } from 'zustand/vanilla';

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

type ProvidersStateCreator = StateCreator<
  State,
  [],
  [],
  ProviderState & ProviderActions
>;

const providers: ProvidersStateCreator = (set, get) => ({
  list: {},
  addProvider: (id, config) => {
    // TODO: fix init data
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
      throw new Error(`No blockchain provider with '${id}' found.`);
    }

    set(
      produce((state: State) => {
        state.providers.list[id].data[key] = value;
      })
    );
  },
});

/************ Blockchain Provider ************/

interface BlockchainProviderConfig {
  namespace: string;
}

type BlockchainProvidersState = {
  list: Record<
    string,
    {
      config: BlockchainProviderConfig;
      data: unknown;
      error: unknown;
    }
  >;
};

type BlochchainProvidersStateCreator = StateCreator<
  State,
  [],
  [],
  BlockchainProvidersState
>;

const blockchainProviders: BlochchainProvidersStateCreator = () => ({
  list: {},
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

interface State {
  hub: HubState;
  providers: ProviderState & ProviderActions;
  blockchainProviders: BlockchainProvidersState;
}

export type Store = StoreApi<State>;
export const createStore = (): Store => {
  return createZustandStore<State>((...api) => {
    return {
      hub: hub(...api),
      providers: providers(...api),
      blockchainProviders: blockchainProviders(...api),
    };
  });
};
