import type { AllProxiedNamespaces } from './types.js';
import type { NamespaceConnectAttempt } from '../errors.js';
import type { NamespaceInputForConnect } from '../legacy/types.js';
import type { ProviderProps } from '../types.js';
import type { Accounts, AccountsWithActiveChain } from '@hub3js/std/types';
import type { Option, Result } from 'ts-results';

import {
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_BITCOINCASH_CHAIN_ID,
  CAIP_DOGECOIN_CHAIN_ID,
  CAIP_LITECOIN_CHAIN_ID,
  CAIP_ZCASH_CHAIN_ID,
} from '@hub3js/bip122';
import { CAIP_NAMESPACE as CAIP_TON_NAMESPACE } from '@hub3js/tvm';
import { formatAddressWithNetwork } from '@rango-dev/internal-blockchains';
import { CAIP_TRON_CHAIN_ID } from '@rango-dev/wallets-core/namespaces/tron';
import { AccountId, type ChainIdParams } from 'caip';
import { Err, None, Ok, Some } from 'ts-results';

import { buildConnectionAttemptError } from '../errors.js';

export function mapCaipNamespaceToLegacyNetworkName(
  chainId: ChainIdParams | string
): string {
  if (typeof chainId === 'string') {
    return chainId;
  }
  const useNamespaceAsNetworkFor = ['solana', 'xrpl', 'stellar'];

  if (useNamespaceAsNetworkFor.includes(chainId.namespace.toLowerCase())) {
    return chainId.namespace.toUpperCase();
  }

  if (chainId.namespace.toLowerCase() === 'eip155') {
    return 'ETH';
  } else if (chainId.reference === CAIP_BITCOIN_CHAIN_ID) {
    return 'BTC';
  } else if (chainId.reference === CAIP_ZCASH_CHAIN_ID) {
    return 'ZCASH';
  } else if (chainId.reference === CAIP_LITECOIN_CHAIN_ID) {
    return 'LTC';
  } else if (chainId.reference === CAIP_DOGECOIN_CHAIN_ID) {
    return 'DOGE';
  } else if (chainId.reference === CAIP_BITCOINCASH_CHAIN_ID) {
    return 'BCH';
  }

  if (chainId.namespace.toLowerCase() === CAIP_TON_NAMESPACE) {
    return 'TON';
  }
  if (chainId.namespace === 'sui' || chainId.reference === CAIP_TRON_CHAIN_ID) {
    return chainId.reference.toUpperCase();
  }
  if (chainId.namespace === 'starknet') {
    return chainId.namespace.toUpperCase();
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
  const { chainId, address } = AccountId.parse(account);
  const network = mapCaipNamespaceToLegacyNetworkName(chainId);
  return formatAddressWithNetwork(address, network);
}

/**
 * Runs a list of (lazy) promises one after another and returns their results in
 * order. The first failure rejects, and the promises after it don't run.
 */
export async function runSequentially<R>(
  promises: Array<() => Promise<R>>
): Promise<R[]> {
  const results: R[] = [];
  for (const task of promises) {
    results.push(await task());
  }
  return results;
}

/**
 * Runs a list of (lazy) promises one after another, even when one fails, and returns
 * each one's outcome in order as a `Result`.
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

export type QueueTaskResult<T> = {
  result: Result<T, unknown>;
  /*
   * The task never ran: the queue abandoned it after an earlier task with the same key
   * failed. `result` then holds that earlier failure.
   */
  cancelled: boolean;
};

type QueueItem<T> = {
  task: () => Promise<T>;
  resolve: (value: QueueTaskResult<T>) => void;
  key: string;
};
/**
 * Creates a queue manager that ensures sequential execution of tasks by key.
 * When multiple tasks with the same key are queued, they are executed one at a time
 * in the order they were added. This prevents race conditions and ensures
 * predictable task execution order.
 *
 */
export function createQueue(options?: {
  onError?: (
    error: unknown,
    actions: {
      cancelWaitingItems: () => void;
    }
  ) => void;
}) {
  const processingKeys = new Set<string>();
  let queue: QueueItem<unknown>[] = [];

  const cancelWaitingItems = (
    currentItem: QueueItem<unknown>,
    error: unknown
  ) => {
    queue = queue.filter((q) => {
      if (q === currentItem || q.key !== currentItem.key) {
        return true;
      }
      q.resolve({ result: new Err(error), cancelled: true });
      return false;
    });
  };

  const processQueue = async () => {
    const currentItem = queue.find((item) => !processingKeys.has(item.key));
    if (!currentItem) {
      return;
    }

    const { task, resolve, key } = currentItem;
    processingKeys.add(key);

    try {
      const result = await task();
      resolve({ result: new Ok(result), cancelled: false });
    } catch (error) {
      if (options?.onError) {
        options.onError(error, {
          cancelWaitingItems: () => cancelWaitingItems(currentItem, error),
        });
      }

      resolve({ result: new Err(error), cancelled: false });
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
  ): Promise<QueueTaskResult<T>> =>
    new Promise((resolve) => {
      queue.push({
        task,
        resolve: resolve as (value: QueueTaskResult<unknown>) => void,
        key,
      });
      void processQueue();
    });

  return queueTask;
}

/**
 * Runs one `connect` attempt for the requested namespaces. `connectNamespaces` passes
 * each namespace's attempt to `reportAttempts` once they have all settled. Anything it
 * throws, such as a config error or saving to storage failing, is added after the
 * namespace failures, unchanged.
 *
 * Throws a `WalletConnectionAttemptError` if anything failed; otherwise returns each
 * namespace's result in request order.
 */
export async function runConnectionAttempt<T>(
  namespaces: NamespaceInputForConnect[] | undefined,
  connectNamespaces: (
    reportAttempts: (attempts: NamespaceConnectAttempt<T>[]) => void
  ) => Promise<void>
): Promise<T[]> {
  let attempts: NamespaceConnectAttempt<T>[] = [];
  let nonNamespaceError: Option<unknown> = None;

  try {
    await connectNamespaces((settledAttempts) => {
      attempts = settledAttempts;
    });
  } catch (error) {
    nonNamespaceError = new Some(error);
  }

  const attemptError = buildConnectionAttemptError({
    requestedNamespaces: namespaces ?? [],
    attempts,
    nonNamespaceError,
  });
  if (attemptError) {
    throw attemptError;
  }

  return attempts.map(({ result }) => result.unwrap());
}

export function shouldTryAutoConnect(
  props: Pick<ProviderProps, 'allBlockChains' | 'autoConnect'>
): boolean {
  return !!props.allBlockChains?.length && !!props.autoConnect;
}
