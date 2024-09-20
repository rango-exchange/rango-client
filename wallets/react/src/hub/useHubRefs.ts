import type { Provider, Store } from '@rango-dev/wallets-core';

import { createStore, Hub } from '@rango-dev/wallets-core';
import { useRef } from 'react';

export function useHubRefs(providers: Provider[]) {
  const store = useRef<Store | null>(null);

  const hub = useRef<Hub | null>(null);

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
    if (hub.current !== null) {
      return hub.current;
    }
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

  return { getStore, getHub };
}
