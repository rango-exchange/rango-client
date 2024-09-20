import type { AllProxiedNamespaces } from './types.js';
import type { Provider } from '@rango-dev/wallets-core';
import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type {
  Accounts,
  AccountsWithActiveChain,
} from '@rango-dev/wallets-core/namespaces/common';
import type { VersionedProviders } from '@rango-dev/wallets-core/utils';

import { legacyFormatAddressWithNetwork as formatAddressWithNetwork } from '@rango-dev/wallets-core/legacy';
import { CAIP, pickVersion } from '@rango-dev/wallets-core/utils';

/* Gets a list of hub and legacy providers and returns a tuple which separates them. */
export function separateLegacyAndHubProviders(
  providers: VersionedProviders[],
  options?: { isExperimentalEnabled?: boolean }
): [LegacyProviderInterface[], Provider[]] {
  const LEGACY_VERSION = '0.0.0';
  const HUB_VERSION = '1.0.0';
  const { isExperimentalEnabled = false } = options || {};

  if (isExperimentalEnabled) {
    const legacyProviders: LegacyProviderInterface[] = [];
    const hubProviders: Provider[] = [];

    providers.forEach((provider) => {
      try {
        const target = pickVersion(provider, HUB_VERSION);
        hubProviders.push(target[1]);
      } catch {
        const target = pickVersion(provider, LEGACY_VERSION);
        legacyProviders.push(target[1]);
      }
    });

    return [legacyProviders, hubProviders];
  }

  const legacyProviders = providers.map(
    (provider) => pickVersion(provider, LEGACY_VERSION)[1]
  );
  return [legacyProviders, []];
}

export function findProviderByType(
  providers: Provider[],
  type: string
): Provider | undefined {
  return providers.find((provider) => provider.id === type);
}

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

export function fromAccountIdToLegacyAddressFormat(account: string): string {
  const { chainId, address } = CAIP.AccountId.parse(account);
  const network = mapCaipNamespaceToLegacyNetworkName(chainId);
  return formatAddressWithNetwork(address, network);
}

/**
 * Getting a list of (lazy) promises and run them one after another.
 * Original code: scripts/publish/utils.mjs
 */
export async function sequentiallyRun<T extends () => Promise<unknown>>(
  promises: Array<T>
): Promise<Array<T extends () => Promise<infer R> ? R : never>> {
  const result = await promises.reduce(async (prev, task) => {
    const previousResults = await prev;
    const taskResult = await task();

    return [...previousResults, taskResult];
  }, Promise.resolve([]) as Promise<any>);
  return result;
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
