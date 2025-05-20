import type { AllProxiedNamespaces } from './types.js';
import type {
  Accounts,
  AccountsWithActiveChain,
} from '@rango-dev/wallets-core/namespaces/common';
import type { Result } from 'ts-results';

import { legacyFormatAddressWithNetwork as formatAddressWithNetwork } from '@rango-dev/wallets-core/legacy';
import { CAIP_BITCOIN_CHAIN_ID } from '@rango-dev/wallets-core/namespaces/utxo';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { Err, Ok } from 'ts-results';

export function mapCaipNamespaceToLegacyNetworkName(
  chainId: CAIP.ChainIdParams | string
): string {
  if (typeof chainId === 'string') {
    return chainId;
  }
  const useNamespaceAsNetworkFor = ['solana'];

  if (useNamespaceAsNetworkFor.includes(chainId.namespace.toLowerCase())) {
    return chainId.namespace.toUpperCase();
  }

  if (chainId.namespace.toLowerCase() === 'eip155') {
    return 'ETH';
  } else if (chainId.reference === CAIP_BITCOIN_CHAIN_ID) {
    return 'BTC';
  }

  if (chainId.namespace === 'sui') {
    return chainId.reference.toUpperCase();
  }

  return chainId.reference;
}

/**
 * CAIP's accountId has a format like this: eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb
 * Legacy format is something like this: ETH:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb
 * This function will try to convert this two format.
 *
 * @see https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-10.md
 */
export function fromAccountIdToLegacyAddressFormat(account: string): string {
  const { chainId, address } = CAIP.AccountId.parse(account);
  const network = mapCaipNamespaceToLegacyNetworkName(chainId);
  return formatAddressWithNetwork(address, network);
}

/**
 * Getting a list of (lazy) promises and run them one after another.
 */

export async function runSequentiallyWithoutFailure<R>(
  promises: Array<() => Promise<R>>
): Promise<Result<R, unknown>[]> {
  return promises.reduce(async (prevPromise, task) => {
    const previousResults = await prevPromise;
    try {
      const taskResult = await task();
      return [...previousResults, new Ok(taskResult)];
    } catch (error) {
      return [...previousResults, new Err(error)];
    }
  }, Promise.resolve<Result<R, unknown>[]>([]));
}

export function isConnectResultEvm(
  result: Awaited<ReturnType<AllProxiedNamespaces['connect']>>
): result is AccountsWithActiveChain {
  return typeof result === 'object' && !Array.isArray(result);
}

export function isConnectResultSolana(
  result: Awaited<ReturnType<AllProxiedNamespaces['connect']>>
): result is Accounts {
  return Array.isArray(result);
}

type QueueItem<T> = {
  task: () => Promise<T>;
  resolve: (value: Result<T, unknown>) => void;
  key: string;
};
/**
 * Creates a queue manager that ensures sequential execution of tasks by key.
 * When multiple tasks with the same key are queued, they are executed one at a time
 * in the order they were added. This prevents race conditions and ensures
 * predictable task execution order.
 *
 */
export function createQueue() {
  const processingKeys = new Set<string>();
  const queue: QueueItem<unknown>[] = [];

  const processQueue = async () => {
    const currentItem = queue.find((item) => !processingKeys.has(item.key));
    if (!currentItem) {
      return;
    }

    const { task, resolve, key } = currentItem;
    processingKeys.add(key);

    try {
      const result = await task();
      resolve(new Ok(result));
    } catch (error) {
      resolve(new Err(error));
    } finally {
      const indexOfCurrentItem = queue.findIndex((item) => item.key === key);
      if (indexOfCurrentItem >= 0) {
        queue.splice(indexOfCurrentItem, 1);
      }
      processingKeys.delete(key);
      void processQueue();
    }
  };

  const queueTask = async <T>(
    task: () => Promise<T>,
    key: string
  ): Promise<Result<T, unknown>> =>
    new Promise((resolve) => {
      queue.push({
        task,
        resolve: resolve as (value: Result<unknown, unknown>) => void,
        key,
      });
      void processQueue();
    });

  return queueTask;
}
