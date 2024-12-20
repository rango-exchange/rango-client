import type { AllProxiedNamespaces } from './types.js';
import type { ConnectResult, ProviderProps } from '../legacy/mod.js';
import type { Hub, Provider, State } from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
  LegacyEventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

import {
  guessProviderStateSelector,
  namespaceStateSelector,
} from '@rango-dev/wallets-core';
import { LegacyEvents as Events } from '@rango-dev/wallets-core/legacy';
import {
  generateStoreId,
  type VersionedProviders,
} from '@rango-dev/wallets-core/utils';
import { pickVersion } from '@rango-dev/wallets-core/utils';
import {
  type AddEthereumChainParameter,
  convertEvmBlockchainMetaToEvmChainInfo,
  Networks,
} from '@rango-dev/wallets-shared';
import { type BlockchainMeta, isEvmBlockchain } from 'rango-types';

import {
  fromAccountIdToLegacyAddressFormat,
  isConnectResultEvm,
  isConnectResultSolana,
} from './helpers.js';

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

/**
 * We will call this function on hub's `subscribe`.
 * it will check states and will emit legacy events for backward compatibility.
 */
export function checkHubStateAndTriggerEvents(
  hub: Hub,
  currentState: State,
  previousState: State,
  onUpdateState: WalletEventHandler,
  allProviders: VersionedProviders[],
  allBlockChains: ProviderProps['allBlockChains']
): void {
  hub.getAll().forEach((provider, providerId) => {
    const currentProviderState = guessProviderStateSelector(
      currentState,
      providerId
    );
    const previousProviderState = guessProviderStateSelector(
      previousState,
      providerId
    );

    let accounts: string[] | null = [];
    /*
     * We don't rely `accounts` to make sure we will trigger proper event on this case:
     * previous value: [0x...]
     * current value: []
     */
    let hasAccountChanged = false;
    let hasNetworkChanged = false;
    let hasProviderDisconnected = false;
    // It will pick the last network from namespaces.
    let maybeNetwork = null;
    provider.getAll().forEach((namespace) => {
      const storeId = generateStoreId(providerId, namespace.namespaceId);
      const currentNamespaceState = namespaceStateSelector(
        currentState,
        storeId
      );
      const previousNamespaceState = namespaceStateSelector(
        previousState,
        storeId
      );

      if (currentNamespaceState.network !== null) {
        maybeNetwork = currentNamespaceState.network;
      }

      // Check for network
      if (currentNamespaceState.network !== previousNamespaceState.network) {
        hasNetworkChanged = true;
      }

      // TODO: `accounts` has been frozen, we should check and find where object.freeze() is calling.

      // Check for accounts
      if (
        previousNamespaceState.accounts?.slice().sort().toString() !==
        currentNamespaceState.accounts?.slice().sort().toString()
      ) {
        if (currentNamespaceState.accounts) {
          const formattedAddresses = currentNamespaceState.accounts.map(
            fromAccountIdToLegacyAddressFormat
          );

          if (accounts) {
            accounts = [...accounts, ...formattedAddresses];
          } else {
            accounts = [...formattedAddresses];
          }

          hasAccountChanged = true;
        } else {
          accounts = null;
          hasProviderDisconnected = true;
        }
      }
    });

    let legacyProvider;
    try {
      legacyProvider = getLegacyProvider(allProviders, providerId);
    } catch (e) {
      console.warn(
        'Having legacy provider is required for including some information like supported chain. ',
        e
      );
    }

    const coreState = {
      connected: currentProviderState.connected,
      connecting: currentProviderState.connecting,
      installed: currentProviderState.installed,
      accounts: accounts,
      network: maybeNetwork,
      reachable: true,
    };

    const eventInfo = {
      supportedBlockchains:
        legacyProvider?.getWalletInfo(allBlockChains || []).supportedChains ||
        [],
      isContractWallet: false,
      isHub: true,
    };

    if (previousProviderState.installed !== currentProviderState.installed) {
      onUpdateState(
        providerId,
        Events.INSTALLED,
        currentProviderState.installed,
        coreState,
        eventInfo
      );
    }
    if (previousProviderState.connecting !== currentProviderState.connecting) {
      onUpdateState(
        providerId,
        Events.CONNECTING,
        currentProviderState.connecting,
        coreState,
        eventInfo
      );
    }
    if (previousProviderState.connected !== currentProviderState.connected) {
      onUpdateState(
        providerId,
        Events.CONNECTED,
        currentProviderState.connected,
        coreState,
        eventInfo
      );
    }
    if (hasAccountChanged) {
      onUpdateState(
        providerId,
        Events.ACCOUNTS,
        accounts,
        coreState,
        eventInfo
      );
    }
    if (hasProviderDisconnected) {
      onUpdateState(providerId, Events.ACCOUNTS, null, coreState, eventInfo);
    }
    if (hasNetworkChanged) {
      onUpdateState(
        providerId,
        Events.NETWORK,
        maybeNetwork,
        coreState,
        eventInfo
      );
    }
  });
}

/**
 * For backward compatibility, there is an special namespace called DISCOVER_MODE.
 * Alongside `DISCOVER_MODE`, `network` will be set as well. here we are manually matching networks to namespaces.
 * This will help us keep the legacy interface and have what hub needs as well.
 */
export function discoverNamespace(network: string): Namespace {
  // This trick is using for enforcing exhaustiveness check.
  network = network as unknown as Networks;
  switch (network) {
    case Networks.AKASH:
    case Networks.BANDCHAIN:
    case Networks.BITCANNA:
    case Networks.BITSONG:
    case Networks.BINANCE:
    case Networks.CRYPTO_ORG:
    case Networks.CHIHUAHUA:
    case Networks.COMDEX:
    case Networks.COSMOS:
    case Networks.CRONOS:
    case Networks.DESMOS:
    case Networks.EMONEY:
    case Networks.INJECTIVE:
    case Networks.IRIS:
    case Networks.JUNO:
    case Networks.KI:
    case Networks.KONSTELLATION:
    case Networks.KUJIRA:
    case Networks.LUMNETWORK:
    case Networks.MEDIBLOC:
    case Networks.OSMOSIS:
    case Networks.PERSISTENCE:
    case Networks.REGEN:
    case Networks.SECRET:
    case Networks.SENTINEL:
    case Networks.SIF:
    case Networks.STARGAZE:
    case Networks.STARNAME:
    case Networks.TERRA:
    case Networks.THORCHAIN:
    case Networks.UMEE:
      return 'Cosmos';
    case Networks.AVAX_CCHAIN:
    case Networks.ARBITRUM:
    case Networks.BOBA:
    case Networks.BSC:
    case Networks.FANTOM:
    case Networks.ETHEREUM:
    case Networks.FUSE:
    case Networks.GNOSIS:
    case Networks.HARMONY:
    case Networks.MOONBEAM:
    case Networks.MOONRIVER:
    case Networks.OPTIMISM:
    case Networks.POLYGON:
    case Networks.STARKNET:
      return 'Evm';
    case Networks.SOLANA:
      return 'Solana';
    case Networks.BTC:
    case Networks.BCH:
    case Networks.DOGE:
    case Networks.LTC:
    case Networks.TRON:
      return 'UTXO';
    case Networks.TON:
      return 'Ton';
    case Networks.POLKADOT:
    case Networks.AXELAR:
    case Networks.MARS:
    case Networks.MAYA:
    case Networks.STRIDE:
    case Networks.Unknown:
      throw new Error("Namespace isn't supported. network: " + network);
  }

  throw new Error(
    "Couldn't matched network with any namespace. it's not discoverable. network: " +
      network
  );
}

export function getLegacyProvider(
  allProviders: VersionedProviders[],
  type: string
): LegacyProviderInterface {
  const [legacy] = separateLegacyAndHubProviders(allProviders);
  const provider = legacy.find((legacyProvider) => {
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
