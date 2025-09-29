import type { ConnectOptions, EvmActions, ProviderAPI } from './types.js';
import type { Context } from '../../hub/namespaces/mod.js';
import type { CanEagerConnect } from '../../hub/namespaces/types.js';
import type { FunctionWithContext } from '../../types/actions.js';

import { recommended as commonRecommended } from '../common/actions.js';

import {
  filterAndGetEvmBlockchainNames,
  formatAccountsToCAIP,
  getAccounts,
  switchOrAddNetwork,
} from './utils.js';

export const recommended = [...commonRecommended];
export function connect(
  instance: () => ProviderAPI,
  options?: ConnectOptions
): FunctionWithContext<EvmActions['connect'], Context> {
  return async (_context, chain) => {
    const evmInstance = instance();

    if (!evmInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }

    if (chain) {
      /*
       * The `switchOrAddNetwork` function can be optionally provided through `options`
       * to handle network switching or addition in a way that is compatible with the specific wallet provider.
       * This approach is necessary because not all providers follow the same conventions—
       * for example, Rabby uses a different error code for "chain not found".
       */
      if (options?.switchOrAddNetwork) {
        await options.switchOrAddNetwork(evmInstance, chain);
      } else {
        await switchOrAddNetwork(evmInstance, chain);
      }
    }

    const providerAccounts = await getAccounts(evmInstance);

    /*
     * Ensure that the provider returns at least one valid account before proceeding.
     * This prevents cases (e.g., MetaMask bug) where a user connects with an account
     * that has no associated EVM address, leaving the dApp without any usable accounts.
     */
    if (!providerAccounts.accounts || !providerAccounts.accounts.length) {
      throw new Error(
        'No accounts were returned by the provider. Please make sure your wallet has an active EVM-compatible account selected.'
      );
    }
    const formattedAccounts = formatAccountsToCAIP(
      providerAccounts.accounts,
      providerAccounts.chainId
    );

    return {
      accounts: formattedAccounts,
      network: providerAccounts.chainId,
    };
  };
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
