import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

import { getBitcoinAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    try {
      const accountsResult = await getBitcoinAccounts();

      if (!accountsResult?.address) {
        throw new Error("Couldn't find any address!");
      }

      return utils.formatAccountsToCAIP(
        [accountsResult.address],
        CAIP_BITCOIN_CHAIN_ID
      );
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
