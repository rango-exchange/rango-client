import type { AllProxiedNamespaces } from './types.js';
import type { UseAdapterParams } from './useHubAdapter.js';
import type { Hub } from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
} from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { WalletType } from '@rango-dev/wallets-shared';

import {
  legacyEagerConnectHandler,
  legacyIsEvmNamespace,
} from '@rango-dev/wallets-core/legacy';

import { HUB_LAST_CONNECTED_WALLETS } from '../legacy/mod.js';

import { sequentiallyRun } from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';
import { convertNamespaceNetworkToEvmChainId } from './utils.js';

/**
 * Run `.connect` action on some selected namespaces (passed as param) for a provider.
 */
async function eagerConnect(
  type: string,
  namespacesInput: LegacyNamespaceInputForConnect[] | undefined,
  params: {
    getHub: () => Hub;
    allBlockChains: UseAdapterParams['allBlockChains'];
  }
) {
  const { getHub, allBlockChains } = params;
  const wallet = getHub().get(type);
  if (!wallet) {
    throw new Error(
      `You should add ${type} to provider first then call 'connect'.`
    );
  }

  if (!namespacesInput) {
    throw new Error('Passing namespace to `connect` is required. ');
  }

  const targetNamespaces: [
    LegacyNamespaceInputForConnect,
    AllProxiedNamespaces
  ][] = [];
  namespacesInput.forEach((namespaceInput) => {
    const targetNamespace: Namespace = namespaceInput.namespace;

    const result = wallet.findByNamespace(targetNamespace);

    if (!result) {
      throw new Error(
        `We couldn't find any provider matched with your request namespace. (requested namespace: ${namespaceInput.namespace})`
      );
    }

    targetNamespaces.push([namespaceInput, result]);
  });

  const finalResult = targetNamespaces.map(([info, namespace]) => {
    const evmChain = legacyIsEvmNamespace(info)
      ? convertNamespaceNetworkToEvmChainId(info, allBlockChains || [])
      : undefined;
    const chain = evmChain || info.network;

    return async () => await namespace.connect(chain);
  });

  /**
   * Sometimes calling methods on a instance in parallel, would cause an error in wallet.
   * We are running a method at a time to make sure we are covering this.
   * e.g. when we are trying to eagerConnect evm and solana on phantom at the same time, the last namespace throw an error.
   */
  return await sequentiallyRun(finalResult);
}

/*
 *
 * Get last connected wallets from storage then run `.connect` on them if `.canEagerConnect` returns true.
 *
 * Note 1:
 *  - It currently use `.getInstance`, `.canEagerConenct` and `getWalletInfo()`.supported chains from legacy provider implementation.
 *  - For each namespace, we don't have a separate `.canEagerConnect`. it's only one and will be used for all namespaces.
 */
export async function autoConnect(deps: {
  getHub: () => Hub;
  allBlockChains: UseAdapterParams['allBlockChains'];
  getLegacyProvider: (type: string) => LegacyProviderInterface;
  wallets?: (WalletType | LegacyProviderInterface)[];
}): Promise<void> {
  const { getHub, allBlockChains, getLegacyProvider, wallets } = deps;

  // Getting connected wallets from storage
  const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
    HUB_LAST_CONNECTED_WALLETS
  );
  const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
  const walletIds = Object.keys(lastConnectedWallets);

  const walletsToRemoveFromPersistance: string[] = [];

  if (walletIds.length) {
    const eagerConnectQueue: any[] = [];

    // Run `.connect` if `.canEagerConnect` returns `true`.
    walletIds.forEach((providerName) => {
      if (wallets && !wallets.includes(providerName)) {
        console.warn(
          'Trying to run auto connect for a wallet which is not included in config. Desired wallet:',
          providerName
        );
        walletsToRemoveFromPersistance.push(providerName);
        return;
      }

      const legacyProvider = getLegacyProvider(providerName);

      let legacyInstance: any;
      try {
        legacyInstance = legacyProvider.getInstance();
      } catch (e) {
        console.warn(
          "It seems instance isn't available yet. This can happens when extension not loaded yet (sometimes when opening browser for first time) or extension is disabled."
        );
        return;
      }

      const namespaces: LegacyNamespaceInputForConnect[] = lastConnectedWallets[
        providerName
      ].map((namespace) => ({
        namespace: namespace.namespace,
        network: namespace.network,
      }));

      const canEagerConnect = async () => {
        if (!legacyProvider.canEagerConnect) {
          throw new Error(
            `${providerName} provider hasn't implemented canEagerConnect.`
          );
        }
        return await legacyProvider.canEagerConnect({
          instance: legacyInstance,
          meta: legacyProvider.getWalletInfo(allBlockChains || [])
            .supportedChains,
        });
      };
      const connectHandler = async () => {
        return eagerConnect(providerName, namespaces, {
          allBlockChains,
          getHub,
        });
      };

      eagerConnectQueue.push(
        legacyEagerConnectHandler({
          canEagerConnect,
          connectHandler,
          providerName,
        }).catch((e) => {
          walletsToRemoveFromPersistance.push(providerName);
          throw e;
        })
      );
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
