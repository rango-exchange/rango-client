import type {
  ProviderAPI as EvmProviderApi,
  ProviderAPI,
} from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/solana';

// Hooks

/*
 * Clover doesn't have a separate change account listener for solana
 * so change account is being detected from its evm instance and
 * solana address will be extracted from its solana instace as a workaround
 */
export const changeAccountSubscriber: (
  evmInstance: () => ProviderAPI,
  solanaInstance: () => SolanaProviderApi
) => ChangeAccountSubscriberBuilder<string[], ProviderAPI> = (
  evmInstance: () => EvmProviderApi,
  solanaInstance: () => SolanaProviderApi
) =>
  new ChangeAccountSubscriberBuilder<string[], EvmProviderApi>()
    .getInstance(evmInstance)
    .format(async (_, __) => {
      const solana = solanaInstance();
      if (!solana) {
        throw new Error('Solana is not available');
      }
      const account = await solana.getAccount();

      return utils.formatAccountsToCAIP(account ? [account] : []);
    })
    .addEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.removeListener?.('accountsChanged', callback);
    });

export const solanaBuilders = { changeAccountSubscriber };
