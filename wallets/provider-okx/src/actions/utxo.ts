import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

import { getBitcoinAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    const accountsResult = await getBitcoinAccounts();

    if (!accountsResult?.address) {
      throw new Error("Couldn't find any address!");
    }

    return utils.formatAccountsToCAIP(
      [accountsResult.address],
      CAIP_BITCOIN_CHAIN_ID
    );
  };
}

export function canEagerConnect(
  instance: () => ProviderAPI
): CanEagerConnect<UtxoActions> {
  return async () => {
    try {
      const accounts = await instance().getAccounts();
      return !!accounts.length;
    } catch {
      return false;
    }
  };
}

export const utxoActions = { connect, canEagerConnect };
