import {
  type Context,
  type FunctionWithContext,
} from '@rango-dev/wallets-core';
import {
  CAIP_BITCOIN_CHAIN_ID,
  type ProviderAPI,
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<UtxoActions['connect'], Context> {
  return async () => {
    const utxoInstance = instance();

    if (!utxoInstance) {
      throw new Error(
        'Do your wallet injected correctly and is utxo compatible?'
      );
    }
    const accounts = await utxoInstance.requestAccounts();

    return utils.formatAccountsToCAIP(accounts, CAIP_BITCOIN_CHAIN_ID);
  };
}

export const utxoActions = { connect };
