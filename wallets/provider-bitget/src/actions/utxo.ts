import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

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

export function canEagerConnect(
  instance: () => ProviderAPI
): CanEagerConnect<UtxoActions> {
  return async () => {
    const accounts = await instance().getAccounts();
    return !!accounts.length;
  };
}

export const utxoActions = { connect, canEagerConnect };
