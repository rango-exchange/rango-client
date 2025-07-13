import type { GenerateDeepLink } from '../../legacy/types.js';
import type { Namespace } from '../../namespaces/common/types.js';
import type { State as InternalProviderState } from '../provider/mod.js';
import type { BlockchainMeta } from 'rango-types';
import type { StateCreator } from 'zustand';

import { produce } from 'immer';

import { ConsumableEvents, type ProviderDetectedEvent } from './events.js';
import { guessProviderStateSelector, type State } from './mod.js';

type Browsers = 'firefox' | 'chrome' | 'edge' | 'brave' | 'homepage';
type Property<N extends string, V> = { name: N; value: V };

type NamespacesProperty = Property<
  'namespaces',
  {
    selection: 'single' | 'multiple';
    data: {
      label: string;
      id: string;
      value: Namespace;
      unsupported?: boolean;
      getSupportedChains: (chains: BlockchainMeta[]) => BlockchainMeta[];
    }[];
  }
>;
type DerivationPathProperty = Property<
  'derivationPath',
  {
    data: {
      id: string;
      label: string;
      namespace: Namespace;
      generateDerivationPath: (index: string) => string;
    }[];
  }
>;
type DetailsProperty = Property<
  'details',
  {
    mobileWallet?: boolean;
    showOnMobile?: boolean;
    isContractWallet?: boolean;
  }
>;

export type ProviderInfo = {
  name: string;
  icon: string;
  extensions: Partial<Record<Browsers, string>>;
  properties?: Array<
    NamespacesProperty | DerivationPathProperty | DetailsProperty
  >;
};

export interface ProviderConfig {
  info: ProviderInfo;
  generateDeepLink?: GenerateDeepLink;
}

interface ProviderData {
  installed: boolean;
}

interface ProviderItem {
  config: ProviderConfig;
  data: ProviderData;
  error: unknown;
}

type ProviderState = {
  events: ConsumableEvents;
  list: Record<string, ProviderItem>;
};
interface ProviderActions {
  addProvider: (id: string, config: ProviderConfig) => void;
  removeProvider: (id: string) => void;
  updateStatus: <K extends keyof ProviderData>(
    id: string,
    key: K,
    value: ProviderData[K]
  ) => void;

  _produceEventsWhenUpdatingStatus: <K extends keyof ProviderData>(
    provider: ProviderItem,
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
  events: new ConsumableEvents(),

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
  removeProvider: (id) => {
    set(
      produce((state: State) => {
        delete state.providers.list[id];
      })
    );
  },
  updateStatus: (id, key, value) => {
    const provider = get().providers.list[id];
    if (!provider) {
      throw new Error(`No namespace namespace with '${id}' found.`);
    }

    get().providers._produceEventsWhenUpdatingStatus(provider, id, key, value);

    set(
      produce((state: State) => {
        state.providers.list[id].data[key] = value;
      })
    );
  },
  guessNamespacesState: (providerId: string): InternalProviderState => {
    return guessProviderStateSelector(get(), providerId);
  },

  _produceEventsWhenUpdatingStatus: (_provider, id, key, _value) => {
    if (key === 'installed') {
      const event: ProviderDetectedEvent = {
        type: 'provider_detected',
        provider: id,
      };

      get().providers.events.push(event);
    }
  },
});

export { providersStore };
