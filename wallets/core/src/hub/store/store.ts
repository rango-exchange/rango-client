import type { StoreApi } from 'zustand/vanilla';

import { createStore as createZustandStore } from 'zustand/vanilla';

import { hubStore, type HubStore } from './hub.js';
import { namespacesStore, type NamespaceStore } from './namespaces.js';
import { providersStore, type ProviderStore } from './providers.js';

/************ State ************/

export interface State {
  hub: HubStore;
  providers: ProviderStore;
  namespaces: NamespaceStore;
}

export type Store = StoreApi<State>;
export const createStore = (): Store => {
  return createZustandStore<State>((...api) => {
    return {
      hub: hubStore(...api),
      providers: providersStore(...api),
      namespaces: namespacesStore(...api),
    };
  });
};
