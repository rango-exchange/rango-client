import type { ProviderProps } from '../legacy/types';
import type { Hub, State } from '@rango-dev/wallets-core';

import {
  guessProviderStateSelector,
  namespaceStateSelector,
} from '@rango-dev/wallets-core';
import {
  Events,
  type LegacyProviderInterface,
  type NamespaceAndNetwork,
  type EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core/legacy';
import { Namespaces } from '@rango-dev/wallets-core/namespaces/common';
import { generateStoreId, type Versions } from '@rango-dev/wallets-core/utils';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  Networks,
} from '@rango-dev/wallets-shared';
import { type BlockchainMeta, isEvmBlockchain } from 'rango-types';

import { fromAccountIdToLegacyAddressFormat, splitProviders } from './helpers';

export function checkHubStateAndTriggerEvents(
  hub: Hub,
  current: State,
  previous: State,
  onUpdateState: WalletEventHandler,
  allProviders: Versions[],
  allBlockChains: ProviderProps['allBlockChains']
) {
  hub.getAll().forEach((provider, providerId) => {
    const currentProviderState = guessProviderStateSelector(
      current,
      providerId
    );
    const previousProviderState = guessProviderStateSelector(
      previous,
      providerId
    );

    let accounts: string[] = [];
    /*
     * We don't rely `accounts` to make sure we will triger proper event on this case:
     * previous value: [0x...]
     * current value: []
     */
    let hasAccountChanged = false;
    let hasNetworkChanged = false;
    // It will pick the last network from namespaces.
    let maybeNetwork = null;
    provider.getAll().forEach((namespace) => {
      const storeId = generateStoreId(providerId, namespace.namespace);
      const currentNamespaceState = namespaceStateSelector(current, storeId);
      const previousNamespaceState = namespaceStateSelector(previous, storeId);

      if (currentNamespaceState.network !== null) {
        maybeNetwork = currentNamespaceState.network;
      }

      // Check for network
      if (currentNamespaceState.network !== previousNamespaceState.network) {
        hasNetworkChanged = true;
      }

      // Check for accounts
      if (
        previousNamespaceState.accounts?.sort().toString() !==
        currentNamespaceState.accounts?.sort().toString()
      ) {
        if (currentNamespaceState.accounts) {
          const formattedAddresses = currentNamespaceState.accounts.map(
            fromAccountIdToLegacyAddressFormat
          );

          accounts = [...accounts, ...formattedAddresses];
          hasAccountChanged = true;
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

export function discoverNamespace(network: string): Namespaces {
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
      return Namespaces.Cosmos;
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
      return Namespaces.Evm;
    case Networks.SOLANA:
      return Namespaces.Solana;
    case Networks.BTC:
    case Networks.BCH:
    case Networks.DOGE:
    case Networks.LTC:
    case Networks.TRON:
      return Namespaces.Utxo;
    case Networks.POLKADOT:
    case Networks.TON:
    case Networks.Unknown:
      throw new Error("Namespace isn't supported. network: " + network);
    default:
      throw new Error(
        "Couldn't matched network with any namespace. it's not discoverable. network: " +
          network
      );
  }
}

export function getLegacyProvider(
  allProviders: Versions[],
  type: string
): LegacyProviderInterface {
  const [legacy] = splitProviders(allProviders);
  const provider = legacy.find((legacyProvider) => {
    return legacyProvider.config.type === type;
  });

  if (!provider) {
    console.warn(
      `You have a provider that hasn't legacy provider. it causes some problems since we need some legacy functionality. Provider Id: ${type}`
    );
    throw new Error(
      `You need to have legacy implementation to use some methods. Provider Id: ${type}`
    );
  }

  return provider;
}

export function convertNamespaceNetworkToEvmChainId(
  namespace: NamespaceAndNetwork<Namespaces.Evm>,
  meta: BlockchainMeta[]
) {
  const evmBlockchainsList = meta.filter(isEvmBlockchain);
  const evmChains = convertEvmBlockchainMetaToEvmChainInfo(evmBlockchainsList);

  return evmChains[namespace.network] || undefined;
}
