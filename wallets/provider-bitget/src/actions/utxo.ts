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

// Bitget reports a UTXO rejection with the generic JSON-RPC internal error code, so its message is matched too.
const BITGET_UTXO_REJECTION_CODE = -32603;
const BITGET_UTXO_REJECTION_MESSAGE = 'User rejected the request';

export function classifyBitgetUtxoConnectionError(
  error: unknown
): ConnectionErrorType {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === BITGET_UTXO_REJECTION_CODE &&
    'message' in error &&
    error.message === BITGET_UTXO_REJECTION_MESSAGE
  ) {
    return ConnectionErrorType.Rejected;
  }
  return isUserRejectionError(error)
    ? ConnectionErrorType.Rejected
    : ConnectionErrorType.Unknown;
}

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<UtxoActions['connect'], Context> {
  return async () => {
    try {
      const utxoInstance = instance();

      if (!utxoInstance) {
        throw new Error(
          'Do your wallet injected correctly and is utxo compatible?'
        );
      }
      const accounts = await utxoInstance.requestAccounts();

      return utils.formatAccountsToCAIP(accounts, CAIP_BITCOIN_CHAIN_ID);
    } catch (error) {
      const type = classifyBitgetUtxoConnectionError(error);
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
    const accounts = await instance().getAccounts();
    return !!accounts.length;
  };
}

export const utxoActions = { connect, canEagerConnect };
