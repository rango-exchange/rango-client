import type {
  Hub,
  State,
  EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core';

import {
  CAIP,
  Events,
  formatAddressWithNetwork,
  guessProviderStateSelector,
  helpers,
  namespaceStateSelector,
} from '@rango-dev/wallets-core';

import { mapCaipNamespaceToNetwork } from './helpers';

export function checkHubStateAndTriggerEvents(
  hub: Hub,
  current: State,
  previous: State,
  onUpdateState: WalletEventHandler
) {
  const result = hub.state();
  console.log('[checkHubStateAndTriggerEvents]', result, { previous, current });

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
    provider.getAll().forEach((namespace) => {
      const storeId = helpers.generateStoreId(providerId, namespace.namespace);
      const currentNamespaceState = namespaceStateSelector(current, storeId);
      const previousNamespaceState = namespaceStateSelector(previous, storeId);

      //
      if (
        previousNamespaceState.accounts?.sort().toString() !==
        currentNamespaceState.accounts?.sort().toString()
      ) {
        if (currentNamespaceState.accounts) {
          const formattedAddresses = currentNamespaceState.accounts.map(
            (account) => {
              const { chainId, address } = CAIP.AccountId.parse(account);
              const network = mapCaipNamespaceToNetwork(chainId);
              return formatAddressWithNetwork(address, network);
            }
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
      network: null,
      reachable: true,
    };

    const eventInfo = {
      supportedBlockchains: [],
      isContractWallet: false,
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
    // TODO: NETWORK
  });
}
