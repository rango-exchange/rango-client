import type { EIP1193EventMap } from './eip1193.js';
import type { ConnectOptions, EvmActions, ProviderAPI } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';
import type {
  CanEagerConnect,
  Context,
  SubscriberCleanUp,
} from '../../hub/namespaces/types.js';
import type { FunctionWithContext } from '../../mod.js';

import { recommended as commonRecommended } from '../common/actions.js';

import {
  createAccountSubscriber,
  createConnect,
  filterAndGetEvmBlockchainNames,
  formatAccountsToCaipAccounts,
} from './utils.js';

export const recommended = [...commonRecommended];

export const connect = (
  instance: () => ProviderAPI,
  options?: ConnectOptions
) =>
  createConnect(
    instance,
    (accounts, chainId) => ({
      accounts,
      network: chainId,
    }),
    options
  );

/**
 * Connects to an EVM wallet provider and returns only the first account.
 *
 * This function is designed for wallet providers like Coinbase Wallet where the
 * currently selected account is always the first item in the accounts list.
 *
 * @param instance - Factory function that returns the wallet provider API instance
 * @param options - Optional configuration for connection behavior
 * @param options.switchOrAddNetwork - Custom function to handle network switching/addition.
 *   Useful for providers that don't follow standard conventions (e.g., Rabby uses different error codes)
 *
 * @returns A function that accepts context and chain parameters and returns connection result
 *
 * @throws {Error} When the wallet provider is not available or not EVM compatible
 *
 */
export const connectSingle = (
  instance: () => ProviderAPI,
  options?: ConnectOptions
) =>
  createConnect(
    instance,
    (accounts, chainId) => ({
      accounts: [accounts[0]],
      network: chainId,
    }),
    options
  );

export const changeAccountSubscriber = (instance: () => ProviderAPI) =>
  createAccountSubscriber(instance, ({ accounts, chainId }) =>
    formatAccountsToCaipAccounts({ accounts, chainId })
  );

/**
 * Subscribes to the `accountsChanged` event from an EVM provider and updates the state
 * using **only the first account** returned by the provider.
 *
 * This is useful in wallets like **Coinbase Wallet**, which includes all connected accounts
 * in the `accountsChanged` event, but places the **currently active account as the first one**.
 *
 *
 * @param instance - A function returning the current EVM provider instance.
 * @returns A tuple of two functions: a `Subscriber` that listens to account changes,
 * and a `SubscriberCleanUp` that removes the listener.
 */
export const changeAccountSubscriberSingle = (instance: () => ProviderAPI) =>
  createAccountSubscriber(instance, ({ accounts, chainId }) =>
    formatAccountsToCaipAccounts({ accounts: [accounts[0]], chainId })
  );

export function changeChainSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  let eventCallback: EIP1193EventMap['chainChanged'];

  return [
    (context) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Trying to subscribe to your EVM wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async (chainId: string) => {
        setState('network', chainId);
      };
      evmInstance.on('chainChanged', eventCallback);
    },
    () => {
      const evmInstance = instance();

      if (eventCallback && evmInstance) {
        evmInstance.removeListener('chainChanged', eventCallback);
      }
    },
  ];
}

export function canEagerConnect(
  instance: () => ProviderAPI | undefined
): CanEagerConnect<EvmActions> {
  return async () => {
    const evmInstance = instance();

    if (!evmInstance) {
      throw new Error(
        'Trying to eagerly connect to your EVM wallet, but seems its instance is not available.'
      );
    }

    try {
      const accounts: string[] = await evmInstance.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
}
export function canSwitchNetwork(): FunctionWithContext<
  EvmActions['canSwitchNetwork'],
  Context
> {
  return (context, params) => {
    const { network, supportedChains } = params;
    return filterAndGetEvmBlockchainNames(supportedChains).includes(network);
  };
}
