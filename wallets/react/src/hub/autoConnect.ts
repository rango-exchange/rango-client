import type { AllProxiedNamespaces } from './types.js';
import type { UseAdapterParams } from './useHubAdapter.js';
import type { Hub, Provider } from '@arlert-dev/wallets-core';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
} from '@arlert-dev/wallets-core/legacy';
import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';
import type { WalletType } from '@arlert-dev/wallets-shared';

import { legacyIsEvmNamespace } from '@arlert-dev/wallets-core/legacy';
import { Result } from 'ts-results';

import { HUB_LAST_CONNECTED_WALLETS } from '../legacy/mod.js';

import { runSequentiallyWithoutFailure } from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';
import { convertNamespaceNetworkToEvmChainId } from './utils.js';

// Getting connected wallets from storage
const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
  HUB_LAST_CONNECTED_WALLETS
);

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

  const connectNamespacesPromises = targetNamespaces.map(
    ([info, namespace]) => {
      const evmChain = legacyIsEvmNamespace(info)
        ? convertNamespaceNetworkToEvmChainId(info, allBlockChains || [])
        : undefined;
      const chain = evmChain || info.network;

      return async () =>
        await namespace.connect(chain).catch((e) => {
          /*
           * Since we check for connect failures using `instanceof Error`
           * this check is added here to make sure the thrown error always is an instance of `Error`
           */
          if (e instanceof Error) {
            throw e;
          }
          throw new Error(e);
        });
    }
  );

  /**
   * Sometimes calling methods on a instance in parallel, would cause an error in wallet.
   * We are running a method at a time to make sure we are covering this.
   * e.g. when we are trying to eagerConnect evm and solana on phantom at the same time, the last namespace throw an error.
   */
  const connectNamespacesResult = await runSequentiallyWithoutFailure(
    connectNamespacesPromises
  );

  const failedNamespaces: LegacyNamespaceInputForConnect[] = targetNamespaces
    .filter((_, index) => connectNamespacesResult[index].err)
    .map((targetNamespace) => targetNamespace[0]);

  if (failedNamespaces.length > 0) {
    lastConnectedWalletsFromStorage.removeNamespacesFromWallet(
      type,
      failedNamespaces.map((namespace) => namespace.namespace)
    );
  }

  const atLeastOneNamespaceConnectedSuccessfully = connectNamespacesResult.some(
    (result) => result.ok
  );
  if (!atLeastOneNamespaceConnectedSuccessfully) {
    throw new Error(`No namespace connected for ${type}`);
  }
  return Result.all(
    ...connectNamespacesResult.filter((result) => result.ok)
  ).unwrap();
}

/**
 * Run `.canEagerConnect` action on some selected namespaces of a wallet.
 */
async function tryRunCanEagerConnect(
  namespaces: LegacyNamespaceInputForConnect[],
  wallet: Provider
): Promise<{
  successNamespaces: LegacyNamespaceInputForConnect[];
  failedNamespaces: LegacyNamespaceInputForConnect[];
}> {
  const foundNamespaces: LegacyNamespaceInputForConnect[] = [];
  const successNamespaces: LegacyNamespaceInputForConnect[] = [];
  const failedNamespaces: LegacyNamespaceInputForConnect[] = [];
  const canEagerConnectPromises: (() => Promise<boolean>)[] = [];

  // 1. Try find namespace instances and create canEagerConnect promises
  namespaces.forEach((namespace) => {
    const namespaceInstance = wallet.findByNamespace(namespace.namespace);
    if (namespaceInstance) {
      foundNamespaces.push(namespace);
      canEagerConnectPromises.push(
        async () => await namespaceInstance.canEagerConnect()
      );
    } else {
      failedNamespaces.push(namespace);
    }
  });

  // 2. Run canEagerConnect sequentially on namespaces
  const canEagerConnectResults = await runSequentiallyWithoutFailure(
    canEagerConnectPromises
  );

  // 3. Separate success and failed namespaces based on canEagerConnect result
  foundNamespaces.forEach((namespace, index) => {
    if (canEagerConnectResults[index].ok && canEagerConnectResults[index].val) {
      successNamespaces.push(namespace);
    } else {
      failedNamespaces.push(namespace);
    }
  });

  return { successNamespaces, failedNamespaces };
}

/*
 * Get last connected wallets and last connected namespaces for each of them from storage
 * Then run `.connect` on each namespace if `.canEagerConnect` returns true.
 */
export async function autoConnect(deps: {
  getHub: () => Hub;
  allBlockChains: UseAdapterParams['allBlockChains'];
  wallets?: (WalletType | LegacyProviderInterface)[];
}): Promise<void> {
  const { getHub, allBlockChains, wallets } = deps;
  const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
  const walletIds = Object.keys(lastConnectedWallets);

  const walletsToRemoveFromPersistence: string[] = [];

  if (walletIds.length) {
    const eagerConnectQueue: Promise<unknown>[] = [];

    // Run `.connect` if `.canEagerConnect` returns `true`.
    walletIds.forEach(async (providerName) => {
      if (wallets && !wallets.includes(providerName)) {
        console.warn(
          'Trying to run auto connect for a wallet which is not included in config. Desired wallet:',
          providerName
        );
        walletsToRemoveFromPersistence.push(providerName);
        return;
      }

      const wallet = getHub().get(providerName);

      const lastConnectedNamespaces: LegacyNamespaceInputForConnect[] =
        lastConnectedWallets[providerName].map((namespace) => ({
          namespace: namespace.namespace,
          network: namespace.network,
        }));

      if (!lastConnectedNamespaces.length || !wallet) {
        walletsToRemoveFromPersistence.push(providerName);
        return;
      }

      const { successNamespaces, failedNamespaces } =
        await tryRunCanEagerConnect(lastConnectedNamespaces, wallet);

      if (!successNamespaces.length) {
        walletsToRemoveFromPersistence.push(providerName);
        return;
      } else if (failedNamespaces.length) {
        lastConnectedWalletsFromStorage.removeNamespacesFromWallet(
          wallet.id,
          failedNamespaces.map((namespace) => namespace.namespace)
        );
      }
      eagerConnectQueue.push(
        eagerConnect(providerName, successNamespaces, {
          allBlockChains,
          getHub,
        }).catch((error) => console.warn(error))
      );
    });

    lastConnectedWalletsFromStorage.removeWallets(
      walletsToRemoveFromPersistence
    );

    await Promise.all(eagerConnectQueue);
  }
}
