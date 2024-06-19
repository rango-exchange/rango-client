import type { UseAdapterProps } from './useAdapter';
import type { Hub, Provider as V1 } from '@rango-dev/wallets-core';
import type {
  LegacyProviderInterface,
  Namespace,
  NamespaceAndNetwork,
} from '@rango-dev/wallets-core/legacy';

import {
  formatAddressWithNetwork,
  isDiscoverMode,
  isEvmNamespace,
} from '@rango-dev/wallets-core/legacy';
import {
  CAIP,
  pickVersion,
  type Versions,
} from '@rango-dev/wallets-core/utils';

import {
  convertNamespaceNetworkToEvmChainId,
  discoverNamespace,
} from './utils';

export function splitProviders(
  providers: Versions[],
  options?: { isExperimentalEnabled?: boolean }
): [LegacyProviderInterface[], V1[]] {
  const { isExperimentalEnabled = false } = options || {};
  if (isExperimentalEnabled) {
    const legacy: LegacyProviderInterface[] = [];
    const experimental: V1[] = [];
    providers.forEach((provider) => {
      try {
        const target = pickVersion(provider, '1.0.0');
        experimental.push(target[1]);
      } catch {
        const target = pickVersion(provider, '0.0.0');
        legacy.push(target[1]);
      }
    });

    return [legacy, experimental];
  }

  const legacy = providers.map(
    (provider) => pickVersion(provider, '0.0.0')[1]
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  );
  return [legacy, []];
}

export function findProviderByType(
  providers: V1[],
  type: string
): V1 | undefined {
  return providers.find((provider) => provider.id === type);
}

export function mapCaipNamespaceToNetwork(
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

export function fromAccountIdToLegacyAddressFormat(account: string) {
  const { chainId, address } = CAIP.AccountId.parse(account);
  const network = mapCaipNamespaceToNetwork(chainId);
  return formatAddressWithNetwork(address, network);
}

export function connect(
  type: string,
  namespaces: NamespaceAndNetwork[] | undefined,
  deps: {
    getHub: () => Hub;
    allBlockChains: UseAdapterProps['allBlockChains'];
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

  // TODO: CommonBlockchains somehow.
  const targetNamespaces: [NamespaceAndNetwork, object][] = [];
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
