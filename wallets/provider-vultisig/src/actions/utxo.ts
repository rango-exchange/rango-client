import type { UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_ZCASH_CHAIN_ID, utils } from '@hub3js/bip122';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

import { getZcashAccounts, requestZcashAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    try {
      const accounts = await requestZcashAccounts();

      return utils.formatAccountsToCAIP(accounts, CAIP_ZCASH_CHAIN_ID);
    } catch (error) {
      const type = isUserRejectionError(error)
        ? ConnectionErrorType.Rejected
        : ConnectionErrorType.Unknown;
      throw new WalletConnectionError(
        getErrorMessage(error) ?? CONNECTION_ERROR_MESSAGES[type],
        { type, cause: error }
      );
    }
  };
}

export function canEagerConnect(): CanEagerConnect<UtxoActions> {
  return async () => {
    const accounts = await getZcashAccounts().catch(() => []);
    return accounts.length > 0;
  };
}

export const utxoActions = { connect, canEagerConnect };
