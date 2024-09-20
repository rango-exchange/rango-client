import { Persistor } from '@rango-dev/wallets-core/legacy';

import {
  HUB_LAST_CONNECTED_WALLETS,
  LEGACY_LAST_CONNECTED_WALLETS,
} from './constants.js';

export interface LastConnectedWalletsStorage {
  [providerId: string]: string[];
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

  addWallet(providerId: string, namespaces: string[]): void {
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
  #addWalletToHub(providerId: string, namespaces: string[]): void {
    const storage = new Persistor<LastConnectedWalletsStorage>();
    const data = storage.getItem(this.#storageKey) || {};

    storage.setItem(this.#storageKey, {
      ...data,
      [providerId]: namespaces,
    });
  }
  #addWalletToLegacy(providerId: string): void {
    const storage = new Persistor<LegacyLastConnectedWalletsStorage>();
    const data = storage.getItem(this.#storageKey) || [];

    storage.setItem(LEGACY_LAST_CONNECTED_WALLETS, data.concat(providerId));
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
