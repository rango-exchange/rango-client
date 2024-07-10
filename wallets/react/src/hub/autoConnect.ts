import type { UseAdapterProps } from './useAdapter';
import type { UseV0Props } from '../legacy/useLegacy';
import type { Hub } from '@rango-dev/wallets-core';
import type {
  LegacyProviderInterface,
  Namespace,
  NamespaceAndNetwork,
} from '@rango-dev/wallets-core/legacy';

import { Persistor } from '@rango-dev/wallets-core/legacy';

import { LAST_CONNECTED_WALLETS_V1 } from '../legacy/constants';

import { connect } from './helpers';

interface LastConnectedWalletsStorage {
  [providerId: string]: string[];
}

export function addWalletToStorage(providerId: string, namespaces: string[]) {
  const persistor = new Persistor<LastConnectedWalletsStorage>();
  let storage = persistor.getItem(LAST_CONNECTED_WALLETS_V1);
  storage ??= {};

  persistor.setItem(LAST_CONNECTED_WALLETS_V1, {
    ...storage,
    [providerId]: namespaces,
  });
}

export function removeWalletsFromStorage(providerIds: string[]) {
  const persistor = new Persistor<LastConnectedWalletsStorage>();
  const storageState = persistor.getItem(LAST_CONNECTED_WALLETS_V1) || {};

  providerIds.forEach((providerId) => {
    if (storageState[providerId]) {
      delete storageState[providerId];
    }
  });

  persistor.setItem(LAST_CONNECTED_WALLETS_V1, storageState);
}

export function shouldTryAutoConnect(
  props: Pick<UseV0Props, 'allBlockChains' | 'autoConnect'>
): boolean {
  return !!props.allBlockChains?.length && !!props.autoConnect;
}

// This is a copy/pasted from core/wallet.ts.
async function eagerConnect(deps: {
  id: string;
  namespaces: NamespaceAndNetwork[];
  getHub: () => Hub;
  allBlockChains: any;
  canEagerConnect: any;
}) {
  const { canEagerConnect, allBlockChains, getHub, id, namespaces } = deps;

  // Check if we can eagerly connect to the wallet
  const eagerConnection = await canEagerConnect();

  if (eagerConnection) {
    // Connect to wallet as usual
    return connect(id, namespaces, {
      allBlockChains,
      getHub,
    });
  }

  const errorMessage = `can't restore connection for ${id} .`;
  throw new Error(errorMessage);
}

/*
 *If a wallet has multiple providers and one of them can be eagerly connected,
 *then the whole wallet will support it at that point and we try to connect to that wallet as usual in eagerConnect method.
 */
export async function autoConnect(deps: {
  getHub: () => Hub;
  allBlockChains: UseAdapterProps['allBlockChains'];
  getLegacyProvider: (type: string) => LegacyProviderInterface;
}) {
  const { getHub, allBlockChains, getLegacyProvider } = deps;
  const persistor = new Persistor<LastConnectedWalletsStorage>();
  const lastConnectedWallets =
    persistor.getItem(LAST_CONNECTED_WALLETS_V1) || {};
  const walletIds = Object.keys(lastConnectedWallets);

  const walletsToRemoveFromPersistance: string[] = [];

  if (walletIds.length) {
    const eagerConnectQueue: any[] = [];
    walletIds.forEach((id) => {
      const legacyProvider = getLegacyProvider(id);

      let legacyInstance;
      try {
        legacyInstance = legacyProvider.getInstance();
      } catch (e) {
        console.warn(
          "It seems instance isn't available yet. This can happens when extension not loaded yet (sometimes when opening browser for first time) or extension is disabled."
        );
        return;
      }

      const namespaces: NamespaceAndNetwork[] = lastConnectedWallets[id].map(
        (namespace) => ({
          namespace: namespace as Namespace,
          network: undefined,
        })
      );
      const promise = eagerConnect({
        id,
        namespaces,
        allBlockChains,
        getHub,
        canEagerConnect: legacyProvider.canEagerConnect?.bind(null, {
          instance: legacyInstance,
          meta: legacyProvider.getWalletInfo(allBlockChains || [])
            .supportedChains,
        }),
      }).catch((e) => {
        walletsToRemoveFromPersistance.push(id);
        throw e;
      });
      eagerConnectQueue.push(promise);
    });

    await Promise.allSettled(eagerConnectQueue);

    /*
     *After successfully connecting to at least one wallet,
     *we will removing the other wallets from persistence.
     *If we are unable to connect to any wallet,
     *the persistence will not be removed and the eager connection will be retried with another page load.
     */
    const canRestoreAnyConnection =
      walletIds.length > walletsToRemoveFromPersistance.length;

    if (canRestoreAnyConnection) {
      removeWalletsFromStorage(walletsToRemoveFromPersistance);
    }
  }
}
