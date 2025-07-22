import type { AllProxiedNamespaces } from './types.js';
import type { Hub, Provider } from '@arlert-dev/wallets-core';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
  LegacyEventHandler as WalletEventHandler,
} from '@arlert-dev/wallets-core/legacy';
import type { Event } from '@arlert-dev/wallets-core/store';

import { LegacyEvents as Events } from '@arlert-dev/wallets-core/legacy';
import { type VersionedProviders } from '@arlert-dev/wallets-core/utils';
import { pickVersion } from '@arlert-dev/wallets-core/utils';
import {
  type AddEthereumChainParameter,
  convertEvmBlockchainMetaToEvmChainInfo,
} from '@arlert-dev/wallets-shared';
import { type BlockchainMeta, isEvmBlockchain } from 'rango-types';

import {
  type ConnectResult,
  HUB_LAST_CONNECTED_WALLETS,
  type ProviderProps,
} from '../legacy/mod.js';

import {
  fromAccountIdToLegacyAddressFormat,
  isConnectResultEvm,
  isConnectResultSolana,
} from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';

/* Gets a list of hub and legacy providers and returns a tuple which separates them. */
export function separateLegacyAndHubProviders(
  providers: VersionedProviders[]
): [LegacyProviderInterface[], Provider[]] {
  const LEGACY_VERSION = '0.0.0';
  const HUB_VERSION = '1.0.0';

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

export function findProviderByType(
  providers: Provider[],
  type: string
): Provider | undefined {
  return providers.find((provider) => provider.id === type);
}

/**
 * We will call this function on hub's `subscribe`.
 * it will check states and will emit legacy events for backward compatibility.
 */

const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
  HUB_LAST_CONNECTED_WALLETS
);

export function getSupportedChainsFromProvider(
  provider: Provider,
  allBlockChains: ProviderProps['allBlockChains']
) {
  const namespacesProperty = provider
    .info()
    ?.properties?.find((property) => property.name === 'namespaces');

  const supportedChains =
    namespacesProperty?.value.data.flatMap((namespace) =>
      namespace.getSupportedChains(allBlockChains || [])
    ) || [];

  return supportedChains;
}

export function mapHubEventsToLegacy(
  hub: Hub,
  event: Event,
  onUpdateState: WalletEventHandler,
  allBlockChains: ProviderProps['allBlockChains']
): void {
  const provider = hub.get(event.provider);
  if (!provider) {
    throw new Error(
      "Currently all the events have assigned to a provider. The event doesn't include one.",
      {
        cause: event,
      }
    );
  }

  // @ts-expect-error for those events that doesn't have namespace, it will be undefinded
  const namespaceId: string | undefined = event.namespace;

  const namespace = namespaceId
    ? provider.findByNamespace(namespaceId)
    : undefined;
  let accounts: string[] | null = null;
  let network: string | null = null;

  if (namespace) {
    const [getNamespaceState] = namespace.state();
    accounts = getNamespaceState().accounts;
    network = getNamespaceState().network;
  }

  const [getProviderState] = provider.state();
  const coreState = {
    connected: getProviderState().connected,
    connecting: getProviderState().connecting,
    installed: getProviderState().installed,
    accounts,
    network,
    reachable: true,
  };

  const eventInfo = {
    supportedBlockchains: getSupportedChainsFromProvider(
      provider,
      allBlockChains
    ),
    isContractWallet: false,
    isHub: true,
    namespace: namespaceId,
  };

  switch (event.type) {
    case 'provider_detected':
      onUpdateState(
        event.provider,
        Events.INSTALLED,
        true,
        coreState,
        eventInfo
      );
      break;
    case 'provider_connecting':
      onUpdateState(
        event.provider,
        Events.CONNECTING,
        event.value,
        coreState,
        eventInfo
      );
      break;
    case 'provider_connected':
      onUpdateState(
        event.provider,
        Events.CONNECTED,
        true,
        coreState,
        eventInfo
      );
      break;
    case 'provider_disconnected':
      onUpdateState(
        event.provider,
        Events.PROVIDER_DISCONNECTED,
        event.provider,
        coreState,
        eventInfo
      );
      onUpdateState(
        event.provider,
        Events.CONNECTED,
        false,
        coreState,
        eventInfo
      );
      onUpdateState(
        event.provider,
        Events.ACCOUNTS,
        null,
        coreState,
        eventInfo
      );
      break;
    case 'namespace_disconnected':
      lastConnectedWalletsFromStorage.removeNamespacesFromWallet(
        event.provider,
        [event.namespace]
      );

      onUpdateState(
        event.provider,
        Events.NAMESPACE_DISCONNECTED,
        event.namespace,
        coreState,
        {
          ...eventInfo,
          namespace: event.namespace,
        }
      );
      // onUpdateState(event.provider, Events.ACCOUNTS, null, coreState, eventInfo);
      break;
    case 'namespace_connected':
    case 'namespace_account_switched':
      {
        if (event.type === 'namespace_account_switched') {
          onUpdateState(
            event.provider,
            Events.NAMESPACE_DISCONNECTED,
            event.namespace,
            coreState,
            eventInfo
          );
        }

        const formattedAddresses = event.accounts.map(
          fromAccountIdToLegacyAddressFormat
        );
        onUpdateState(
          event.provider,
          Events.ACCOUNTS,
          formattedAddresses,
          coreState,
          {
            ...eventInfo,
            namespace: event.namespace,
          }
        );
      }
      break;
    case 'namespace_network_switched':
      onUpdateState(event.provider, Events.NETWORK, event.network, coreState, {
        ...eventInfo,
        namespace: event.namespace,
      });
      break;
  }
}

export function getAllLegacyProviders(
  allProviders: VersionedProviders[]
): LegacyProviderInterface[] {
  const LEGACY_VERSION = '0.0.0';

  const legacyProviders: LegacyProviderInterface[] = [];

  allProviders.forEach((provider) => {
    const target = pickVersion(provider, LEGACY_VERSION);
    legacyProviders.push(target[1]);
  });

  return legacyProviders;
}

export function getLegacyProvider(
  allProviders: VersionedProviders[],
  type: string
): LegacyProviderInterface {
  const legacyProviders: LegacyProviderInterface[] =
    getAllLegacyProviders(allProviders);

  const provider = legacyProviders.find((legacyProvider) => {
    return legacyProvider.config.type === type;
  });

  if (!provider) {
    console.warn(
      `You have a provider that doesn't have legacy provider. It causes some problems since we need some legacy functionality. Provider Id: ${type}`
    );
    throw new Error(
      `You need to have legacy implementation to use some methods. Provider Id: ${type}`
    );
  }

  return provider;
}

/**
 * In legacy mode, for those who have switch network functionality (like evm), we are using an enum for network names
 * this enum only has meaning for us, and when we are going to connect an instance (e.g. window.ethereum) we should pass chain id.
 */
export function convertNamespaceNetworkToEvmChainId(
  namespace: LegacyNamespaceInputForConnect,
  meta: BlockchainMeta[]
) {
  if (!namespace.network) {
    return undefined;
  }

  const evmBlockchainsList = meta.filter(isEvmBlockchain);
  const evmChains = convertEvmBlockchainMetaToEvmChainInfo(evmBlockchainsList);

  return evmChains[namespace.network];
}

/**
 * We are passing an string for chain id (e.g. ETH, POLYGON), but wallet's instances (e.g. window.ethereum) needs chainId (e.g. 0x1).
 * This function will help us to map these strings to proper hex ids.
 *
 * If you need same functionality for other blockchain types (e.g. Cosmos), You can make a separate function and add it here.
 */
export function tryConvertNamespaceNetworkToChainInfo(
  namespace: LegacyNamespaceInputForConnect,
  meta: BlockchainMeta[]
): string | AddEthereumChainParameter | undefined {
  // `undefined` means it's not evm or we couldn't find it in meta.
  const evmChain = convertNamespaceNetworkToEvmChainId(namespace, meta);
  const network = evmChain || namespace.network;

  return network;
}

export function transformHubResultToLegacyResult(
  res: Awaited<ReturnType<AllProxiedNamespaces['connect']>>
): ConnectResult {
  if (isConnectResultEvm(res)) {
    return {
      accounts: res.accounts,
      network: res.network,
      provider: undefined,
    };
  } else if (isConnectResultSolana(res)) {
    return {
      accounts: res,
      network: null,
      provider: undefined,
    };
  }

  return {
    accounts: [res],
    network: null,
    provider: undefined,
  };
}

/**
 * Synchronizes providers in the hub with the configuration providers.
 * - Registers and initializes any configuration providers not yet in the hub
 * - Removes providers from the hub that aren't in the configuration
 */
export function synchronizeHubWithConfigProviders(
  hub: Hub,
  configurationProviders: Provider[]
) {
  const registeredProviders = hub.getAll();

  // Register and initialize providers that exist in config but not in hub
  const providersToRegister = configurationProviders.filter(
    (configProvider) => !registeredProviders.get(configProvider.id)
  );

  providersToRegister.forEach((providerToRegister) => {
    hub.add(providerToRegister.id, providerToRegister);
    providerToRegister.init();
  });

  // Remove providers that exist in hub but not in config
  registeredProviders.forEach((registeredProvider) => {
    const isProviderInConfig = configurationProviders.some(
      (configProvider) => configProvider.id === registeredProvider.id
    );

    if (!isProviderInConfig) {
      hub.remove(registeredProvider.id);
    }
  });
}
