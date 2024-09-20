import type { AllProxiedNamespaces } from './types.js';
import type { UseAdapterParams } from './useHubAdapter.js';
import type { Hub, Provider } from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInput,
  LegacyProviderInterface,
  LegacyNamespace as Namespace,
} from '@rango-dev/wallets-core/legacy';
import type {
  Accounts,
  AccountsWithActiveChain,
} from '@rango-dev/wallets-core/namespaces/common';
import type { VersionedProviders } from '@rango-dev/wallets-core/utils';

import {
  legacyFormatAddressWithNetwork as formatAddressWithNetwork,
  isDiscoverMode,
  isEvmNamespace,
} from '@rango-dev/wallets-core/legacy';
import { CAIP, pickVersion } from '@rango-dev/wallets-core/utils';

import {
  convertNamespaceNetworkToEvmChainId,
  discoverNamespace,
} from './utils.js';

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

export function connect(
  type: string,
  namespaces: LegacyNamespaceInput[] | undefined,
  deps: {
    getHub: () => Hub;
    allBlockChains: UseAdapterParams['allBlockChains'];
  }
) {
  const { getHub, allBlockChains } = deps;
  const wallet = getHub().get(type);
  if (!wallet) {
    throw new Error(
      `You should add ${type} to provider first then call 'connect'.`
    );
  }

  if (!namespaces) {
    /*
     * TODO: I think this should be wallet.connect()
     * TODO: This isn't needed anymore since we can add a discovery namespace.
     * TODO: if the next line uncomnented, make sure we are handling autoconnect persist as well.
     * return getHub().runAll('connect');
     */
    throw new Error(
      'Passing namespace to `connect` is required. you can pass DISCOVERY_MODE for legacy.'
    );
  }

  // TODO: CommonNamespaces somehow.
  const targetNamespaces: [LegacyNamespaceInput, object][] = [];
  namespaces.forEach((namespace) => {
    let targetNamespace: Namespace;
    if (isDiscoverMode(namespace)) {
      targetNamespace = discoverNamespace(namespace.network);
    } else {
      targetNamespace = namespace.namespace;
    }

    const result = wallet.findByNamespace(targetNamespace);

    if (!result) {
      throw new Error(
        `We couldn't find any provider matched with your request namespace. (requested namespace: ${namespace.namespace})`
      );
    }

    targetNamespaces.push([namespace, result]);
  });

  const finalResult = targetNamespaces.map(([info, namespace]) => {
    const evmChain = isEvmNamespace(info)
      ? convertNamespaceNetworkToEvmChainId(info, allBlockChains || [])
      : undefined;
    const chain = evmChain || info.network;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    return namespace.connect(chain);
  });

  return finalResult;
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
