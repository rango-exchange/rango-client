import type { UseAdapterParams } from './useHubAdapter.js';
import type { Hub } from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInput,
  LegacyProviderInterface,
  LegacyNamespace as Namespace,
} from '@rango-dev/wallets-core/legacy';

import { legacyEagerConnectHandler } from '@rango-dev/wallets-core/legacy';

import { HUB_LAST_CONNECTED_WALLETS } from '../legacy/mod.js';

import { connect } from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';

/*
 *If a wallet has multiple namespace and one of them can be eagerly connected,
 *then the whole wallet will support it at that point and we try to connect to that wallet as usual in eagerConnect method.
 */
export async function autoConnect(deps: {
  getHub: () => Hub;
  allBlockChains: UseAdapterParams['allBlockChains'];
  getLegacyProvider: (type: string) => LegacyProviderInterface;
}) {
  const { getHub, allBlockChains, getLegacyProvider } = deps;

  const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
    HUB_LAST_CONNECTED_WALLETS
  );
  const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
  const walletIds = Object.keys(lastConnectedWallets);

  const walletsToRemoveFromPersistance: string[] = [];

  if (walletIds.length) {
    const eagerConnectQueue: any[] = [];
    walletIds.forEach((id) => {
      const legacyProvider = getLegacyProvider(id);

      let legacyInstance: any;
      try {
        legacyInstance = legacyProvider.getInstance();
      } catch (e) {
        console.warn(
          "It seems instance isn't available yet. This can happens when extension not loaded yet (sometimes when opening browser for first time) or extension is disabled."
        );
        return;
      }

      const namespaces: LegacyNamespaceInput[] = lastConnectedWallets[id].map(
        (namespace) => ({
          namespace: namespace as Namespace,
          network: undefined,
        })
      );

      const promise = legacyEagerConnectHandler({
        canEagerConnect: async () => {
          if (!legacyProvider.canEagerConnect) {
            throw new Error(
              `${id} provider hasn't implemented canEagerConnect.`
            );
          }
          return await legacyProvider.canEagerConnect({
            instance: legacyInstance,
            meta: legacyProvider.getWalletInfo(allBlockChains || [])
              .supportedChains,
          });
        },
        connectHandler: async () => {
          return connect(id, namespaces, {
            allBlockChains,
            getHub,
          });
        },
        providerName: id,
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
      lastConnectedWalletsFromStorage.removeWallets(
        walletsToRemoveFromPersistance
      );
    }
  }
}
