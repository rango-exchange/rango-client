import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';

import { Persistor } from '@arlert-dev/wallets-core/legacy';

import {
  HUB_LAST_CONNECTED_WALLETS,
  LEGACY_LAST_CONNECTED_WALLETS,
} from './constants.js';

export interface NamespaceInput {
  namespace: Namespace;
  network: string | undefined;
}

export interface LastConnectedWalletsStorage {
  [providerId: string]: NamespaceInput[];
}

export type LegacyLastConnectedWalletsStorage = string[];

/**
 * We are doing some certain actions on storage for `last-connected-wallets` key.
 * This class helps us to define them in one place and also it has support for both legacy and hub.
 */
export class LastConnectedWalletsFromStorage {
  #storageKey: string;

  constructor(storageKey: string) {
    this.#storageKey = storageKey;
  }

  addWallet(providerId: string, namespaces: NamespaceInput[]): void {
    if (this.#storageKey === HUB_LAST_CONNECTED_WALLETS) {
      return this.#addWalletToHub(providerId, namespaces);
    } else if (this.#storageKey === LEGACY_LAST_CONNECTED_WALLETS) {
      return this.#addWalletToLegacy(providerId);
    }
    throw new Error('Not implemented');
  }
  removeWallets(providerIds?: string[]): void {
    if (this.#storageKey === HUB_LAST_CONNECTED_WALLETS) {
      return this.#removeWalletsFromHub(providerIds);
    } else if (this.#storageKey === LEGACY_LAST_CONNECTED_WALLETS) {
      return this.#removeWalletsFromLegacy(providerIds);
    }
    throw new Error('Not implemented');
  }
  list(): LastConnectedWalletsStorage {
    if (this.#storageKey === HUB_LAST_CONNECTED_WALLETS) {
      return this.#listFromHub();
    } else if (this.#storageKey === LEGACY_LAST_CONNECTED_WALLETS) {
      return this.#listFromLegacy();
    }
    throw new Error('Not implemented');
  }
  removeNamespacesFromWallet(providerId: string, namespaceIds: string[]) {
    if (this.#storageKey === HUB_LAST_CONNECTED_WALLETS) {
      return this.#removeNamespaceFromWalletHub(providerId, namespaceIds);
    }
    throw new Error('Not implemented');
  }

  #listFromLegacy(): LastConnectedWalletsStorage {
    const persistor = new Persistor<LegacyLastConnectedWalletsStorage>();
    const lastConnectedWallets =
      persistor.getItem(LEGACY_LAST_CONNECTED_WALLETS) || [];
    const output: LastConnectedWalletsStorage = {};
    lastConnectedWallets.forEach((provider) => {
      // Setting empty namespaces
      output[provider] = [];
    });
    return output;
  }
  #listFromHub(): LastConnectedWalletsStorage {
    const persistor = new Persistor<LastConnectedWalletsStorage>();
    const lastConnectedWallets =
      persistor.getItem(HUB_LAST_CONNECTED_WALLETS) || {};
    return lastConnectedWallets;
  }
  #addWalletToHub(providerId: string, namespaces: NamespaceInput[]): void {
    const storage = new Persistor<LastConnectedWalletsStorage>();
    const storageState = storage.getItem(this.#storageKey) || {};

    let toBeAddedNamespaces = namespaces;

    // If provider already exits in the storage, we should just add new namespaces to the previously added namespaces.
    if (!!storageState[providerId]) {
      const storedNamespaces = storageState[providerId];
      toBeAddedNamespaces = storedNamespaces.concat(
        namespaces.filter(
          (namespace) =>
            !storedNamespaces.some(
              (storedNamespace) =>
                storedNamespace.namespace === namespace.namespace
            )
        )
      );
    }

    storage.setItem(this.#storageKey, {
      ...storageState,
      [providerId]: toBeAddedNamespaces,
    });
  }
  #addWalletToLegacy(providerId: string): void {
    const storage = new Persistor<LegacyLastConnectedWalletsStorage>();
    const storageState = storage.getItem(this.#storageKey) || [];

    storage.setItem(
      LEGACY_LAST_CONNECTED_WALLETS,
      storageState.concat(providerId)
    );
  }
  #removeWalletsFromHub(providerIds?: string[]): void {
    const persistor = new Persistor<LastConnectedWalletsStorage>();
    const storageState = persistor.getItem(this.#storageKey) || {};

    // Remove all wallets
    if (!providerIds) {
      persistor.setItem(this.#storageKey, {});
      return;
    }

    // Remove some of the wallets
    providerIds.forEach((providerId) => {
      if (storageState[providerId]) {
        delete storageState[providerId];
      }
    });

    persistor.setItem(this.#storageKey, storageState);
  }
  #removeNamespaceFromWalletHub(
    providerId: string,
    namespaceIds: string[]
  ): void {
    const persistor = new Persistor<LastConnectedWalletsStorage>();
    const storageState = persistor.getItem(this.#storageKey) || {};

    const currentProviderNamespaces = storageState[providerId];
    const newProviderNamespaces = currentProviderNamespaces?.filter(
      (namespace) => !namespaceIds.includes(namespace.namespace)
    );

    this.#removeWalletsFromHub([providerId]);
    if (newProviderNamespaces?.length > 0) {
      this.#addWalletToHub(providerId, newProviderNamespaces);
    }
  }
  #removeWalletsFromLegacy(providerIds?: string[]): void {
    const persistor = new Persistor<LegacyLastConnectedWalletsStorage>();
    const storageState = persistor.getItem(this.#storageKey) || [];

    // Remove all wallets
    if (!providerIds) {
      persistor.setItem(this.#storageKey, []);
      return;
    }

    // Remove some of the wallets
    persistor.setItem(
      LEGACY_LAST_CONNECTED_WALLETS,
      storageState.filter((wallet) => !providerIds.includes(wallet))
    );
  }
}
