import type {
  Hub,
  State,
  EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core';

import {
  Events,
  guessProviderStateSelector,
  helpers,
  namespaceStateSelector,
} from '@rango-dev/wallets-core';

import { fromAccountIdToLegacyAddressFormat } from './helpers';

export function checkHubStateAndTriggerEvents(
  hub: Hub,
  current: State,
  previous: State,
  onUpdateState: WalletEventHandler
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
      const storeId = helpers.generateStoreId(providerId, namespace.namespace);
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

    const coreState = {
      connected: currentProviderState.connected,
      connecting: currentProviderState.connecting,
      installed: currentProviderState.installed,
      accounts: accounts,
      network: maybeNetwork,
      reachable: true,
    };

    const eventInfo = {
      supportedBlockchains: [],
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
    // TODO: NETWORK
  });
}
