import type { UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_ZCASH_CHAIN_ID, utils } from '@hub3js/bip122';

import { getZcashAccounts, requestZcashAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    const accounts = await requestZcashAccounts();

    return utils.formatAccountsToCAIP(accounts, CAIP_ZCASH_CHAIN_ID);
  };
}

export function canEagerConnect(): CanEagerConnect<UtxoActions> {
  return async () => {
    const accounts = await getZcashAccounts().catch(() => []);
    return accounts.length > 0;
  };
}

export const utxoActions = { connect, canEagerConnect };
