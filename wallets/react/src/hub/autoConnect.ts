import type { AllProxiedNamespaces } from './types.js';
import type { UseAdapterParams } from './useHubAdapter.js';
import type { NamespaceConnectAttempt } from '../errors.js';
import type {
  EventHandler,
  NamespaceInputForConnect,
} from '../legacy/types.js';
import type { Hub, Provider, WalletType } from '@hub3js/core';
import type { DefaultNamespaces, Namespace } from '@hub3js/namespaces';
import type { Accounts, AccountsWithActiveChain } from '@hub3js/std/types';

import { Result } from 'ts-results';

import { buildAutoConnectionAttemptError } from '../errors.js';
import { Events } from '../legacy/types.js';

import { HUB_LAST_CONNECTED_WALLETS } from './constants.js';
import { runSequentially, runSequentiallyWithoutFailure } from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';
import {
  convertNamespaceNetworkToEvmChainId,
  getProviderCoreState,
  getProviderEventInfo,
  isEvmNamespace,
} from './utils.js';

function isEvmNamespaceInput(
  namespace: NamespaceInputForConnect
): namespace is NamespaceInputForConnect<'EVM'> {
  return namespace.namespace === 'EVM';
}

// Getting connected wallets from storage
const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
  HUB_LAST_CONNECTED_WALLETS
);

/**
 * Run `.connect` action on some selected namespaces (passed as param) for a provider.
 */
async function eagerConnect(
  type: string,
  namespacesInput: NamespaceInputForConnect[] | undefined,
  params: {
    getHub: () => Hub;
    allBlockChains: UseAdapterParams['allBlockChains'];
    onUpdateState?: EventHandler;
  }
) {
  const { getHub, allBlockChains, onUpdateState } = params;
  const wallet = getHub().get(type);
  if (!wallet) {
    throw new Error(
      `You should add ${type} to provider first then call 'connect'.`
    );
  }

  if (!namespacesInput) {
    throw new Error('Passing namespace to `connect` is required. ');
  }

  const targetNamespaces: [NamespaceInputForConnect, AllProxiedNamespaces][] =
    [];
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
      const evmChain = isEvmNamespaceInput(info)
        ? convertNamespaceNetworkToEvmChainId(info, allBlockChains || [])
        : undefined;
      const chain = evmChain || info.network;

      return async (): Promise<NamespaceConnectAttempt> => {
        let connectNamespacePromise: () => Promise<
          Accounts | AccountsWithActiveChain
        >;
        if (isEvmNamespace(namespace)) {
          connectNamespacePromise = async () => namespace.connect(chain);
        } else {
          connectNamespacePromise = async () => namespace.connect();
        }
        return {
          input: info,
          result: await Result.wrapAsync(connectNamespacePromise),
        };
      };
    }
  );

  /**
   * Sometimes calling methods on a instance in parallel, would cause an error in wallet.
   * We are running a method at a time to make sure we are covering this.
   * e.g. when we are trying to eagerConnect evm and solana on phantom at the same time, the last namespace throw an error.
   */
  const attempts = await runSequentially(connectNamespacesPromises);

  const failedNamespaces = attempts
    .filter(({ result }) => result.err)
    .map(({ input }) => input.namespace);

  if (failedNamespaces.length > 0) {
    lastConnectedWalletsFromStorage.removeNamespacesFromWallet(
      type,
      failedNamespaces
    );
  }

  const autoConnectionAttemptError = buildAutoConnectionAttemptError(attempts);
  if (autoConnectionAttemptError) {
    onUpdateState?.(
      type,
      Events.AUTO_CONNECT_FAILED,
      autoConnectionAttemptError,
      getProviderCoreState(wallet),
      getProviderEventInfo(wallet, allBlockChains)
    );
  }

  const connectNamespacesResult = attempts.map(({ result }) => result);
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
  namespaces: NamespaceInputForConnect[],
  wallet: Provider<DefaultNamespaces>
): Promise<{
  successNamespaces: NamespaceInputForConnect[];
  failedNamespaces: NamespaceInputForConnect[];
}> {
  const foundNamespaces: NamespaceInputForConnect[] = [];
  const successNamespaces: NamespaceInputForConnect[] = [];
  const failedNamespaces: NamespaceInputForConnect[] = [];
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
  wallets?: (WalletType | Provider)[];
  onUpdateState?: EventHandler;
}): Promise<void> {
  const { getHub, allBlockChains, wallets, onUpdateState } = deps;
  const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
  const walletIds = Object.keys(lastConnectedWallets);

  const walletsToRemoveFromPersistence: string[] = [];

  if (walletIds.length) {
    const eagerConnectQueue: Promise<unknown>[] = [];

    const configWalletNames = wallets?.map((wallet) =>
      typeof wallet === 'string' ? wallet : wallet.id
    );
    // Run `.connect` if `.canEagerConnect` returns `true`.
    walletIds.forEach(async (providerName) => {
      if (configWalletNames && !configWalletNames.includes(providerName)) {
        console.warn(
          'Trying to run auto connect for a wallet which is not included in config. Desired wallet:',
          providerName
        );
        walletsToRemoveFromPersistence.push(providerName);
        return;
      }

      const wallet = getHub().get(providerName);

      const lastConnectedNamespaces: NamespaceInputForConnect[] =
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
          onUpdateState,
        }).catch((error) => console.warn(error))
      );
    });

    lastConnectedWalletsFromStorage.removeWallets(
      walletsToRemoveFromPersistence
    );

    await Promise.all(eagerConnectQueue);
  }
}
