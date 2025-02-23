import type { Provider, Store } from '@rango-dev/wallets-core';

import { createStore, Hub } from '@rango-dev/wallets-core';
import { useRef } from 'react';

import { checkProviderListsEquality } from './utils.js';

export function useHubRefs(providers: Provider[]) {
  const store = useRef<Store | null>(null);

  const hub = useRef<Hub | null>(null);

  function createHub() {
    const createdHub = new Hub({
      store: getStore(),
    });
    /*
     * First add providers to hub
     * This helps to `getWalletInfo` be usable, before initialize.
     */
    providers.forEach((provider) => {
      createdHub.add(provider.id, provider);
    });
    hub.current = createdHub;
    return createdHub;
  }

  // https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
  function getStore() {
    if (store.current !== null) {
      return store.current;
    }
    const createdStore = createStore();
    store.current = createdStore;
    return createdStore;
  }

  function getHub(): Hub {
    const hubProviders = hub.current?.getAll();

    if (
      !hub.current ||
      !hubProviders ||
      // If hub does not contain a provider, it should be added
      !checkProviderListsEquality(Array.from(hubProviders.values()), providers)
    ) {
      return createHub();
    }
    return hub.current;
  }

  return { getStore, getHub };
}
