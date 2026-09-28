import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type { Context, FunctionWithContext } from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<UtxoActions['connect'], Context> {
  return async () => {
    try {
      const accounts = await instance().requestAccounts();

      return utils.formatAccountsToCAIP(accounts, CAIP_BITCOIN_CHAIN_ID);
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

export const utxoActions = { connect };
