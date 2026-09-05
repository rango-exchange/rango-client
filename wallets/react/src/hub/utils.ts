import type { AllProxiedNamespaces } from './types.js';
import type {
  ConnectResult,
  NamespaceInputForConnect,
  EventHandler as WalletEventHandler,
} from '../legacy/mod.js';
import type { ProviderProps } from '../types.js';
import type { UtxoActions } from '@hub3js/bip122';
import type { Hub, Provider, ProxiedNamespace, WalletType } from '@hub3js/core';
import type { Event } from '@hub3js/core/store';
import type {
  Chain as AddEthereumChainParameter,
  EvmActions,
} from '@hub3js/evm';
import type { SolanaActions } from '@hub3js/solana';

import { pickVersion, type VersionedProviders } from '@hub3js/core/utils';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  formatAddressWithNetwork,
  getBlockChainNameFromId,
  getSupportedChainsFromProvider,
} from '@rango-dev/internal-blockchains';
import { AccountId } from 'caip';
import { type BlockchainMeta, isEvmBlockchain } from 'rango-types';

import { Events } from '../legacy/mod.js';

import { HUB_LAST_CONNECTED_WALLETS } from './constants.js';
import {
  fromAccountIdToLegacyAddressFormat,
  isConnectResultEvm,
  isConnectResultSolana,
} from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';

export function getHubProviders(providers: VersionedProviders[]): Provider[] {
  return providers.map((provider) => {
    try {
      return pickVersion(provider, '1.0.0')[1] as Provider;
    } catch {
      throw new Error(
        "Legacy providers aren't supported anymore. Expected a provider with version '1.0.0'."
      );
    }
  });
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

export function mapHubEventsToLegacy(
  hub: Hub,
  event: Event,
  onUpdateState: WalletEventHandler,
  metadata: {
    allBlockChains: ProviderProps['allBlockChains'];
    lastConnectAttemptParams: {
      [type: WalletType]: NamespaceInputForConnect[];
    };
  }
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
  let derivationPath: string | undefined;

  if (namespace) {
    const [getNamespaceState] = namespace.state();
    accounts = getNamespaceState().accounts;
    network = getNamespaceState().network;

    if (metadata.lastConnectAttemptParams[event.provider]) {
      derivationPath = metadata.lastConnectAttemptParams[event.provider].find(
        (namespace) => namespace.namespace === namespaceId
      )?.derivationPath;
    }
  }

  const [getProviderState] = provider.state();
  const coreState = {
    connected: getProviderState().connected,
    connecting: getProviderState().connecting,
    installed: getProviderState().installed,
    accounts,
    network,
    reachable: true,
    derivationPath,
  };

  const detailsProperty = provider
    .info()
    ?.metadata.properties?.find((property) => property.name === 'details');

  const eventInfo = {
    supportedBlockchains: getSupportedChainsFromProvider(
      provider,
      metadata.allBlockChains
    ),
    isContractWallet: detailsProperty?.value?.isContractWallet ?? false,
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

        let formattedAddresses: string[] = [];
        if (eventInfo.isContractWallet) {
          formattedAddresses = event.accounts.map((account) => {
            const { chainId, address } = AccountId.parse(account);
            if (typeof chainId === 'string') {
              throw new Error('Should be in CAIP format');
            }
            const blockchainName = getBlockChainNameFromId(
              chainId.reference,
              eventInfo.supportedBlockchains
            );

            return blockchainName
              ? formatAddressWithNetwork(address, blockchainName)
              : fromAccountIdToLegacyAddressFormat(account);
          });
        } else {
          formattedAddresses = event.accounts.map((accounts) =>
            fromAccountIdToLegacyAddressFormat(accounts)
          );
        }

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

/**
 * In legacy mode, for those who have switch network functionality (like evm), we are using an enum for network names
 * this enum only has meaning for us, and when we are going to connect an instance (e.g. window.ethereum) we should pass chain id.
 */
export function convertNamespaceNetworkToEvmChainId(
  namespace: NamespaceInputForConnect,
  meta: BlockchainMeta[]
): AddEthereumChainParameter | undefined {
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
 */
export function tryConvertNamespaceNetworkToChainInfo(
  namespace: NamespaceInputForConnect,
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
    };
  } else if (isConnectResultSolana(res)) {
    return {
      accounts: res,
      network: null,
    };
  }

  return {
    accounts: [res],
    network: null,
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

export function isSolanaNamespace(
  ns: AllProxiedNamespaces
): ns is AllProxiedNamespaces &
  ProxiedNamespace<SolanaActions> & { namespaceId: 'Solana' } {
  return ns.namespaceId === 'Solana';
}
export function isEvmNamespace(
  ns: AllProxiedNamespaces
): ns is AllProxiedNamespaces &
  ProxiedNamespace<EvmActions> & { namespaceId: 'EVM' } {
  return ns.namespaceId === 'EVM';
}
export function isUtxoNamespace(
  ns: AllProxiedNamespaces
): ns is AllProxiedNamespaces &
  ProxiedNamespace<UtxoActions> & { namespaceId: 'UTXO' } {
  return ns.namespaceId === 'UTXO';
}
