import type { AllProxiedNamespaces } from './types.js';
import type {
  Accounts,
  AccountsWithActiveChain,
} from '@rango-dev/wallets-core/namespaces/common';
import type { Result } from 'ts-results';

import { legacyFormatAddressWithNetwork as formatAddressWithNetwork } from '@rango-dev/wallets-core/legacy';
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
