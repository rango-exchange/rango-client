import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';
import { getErrorMessage, Hub3Error } from '@hub3js/core';

import {
  BITGET_UTXO_REJECTION_CODE,
  BITGET_UTXO_REJECTION_MESSAGE,
} from '../constants.js';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<UtxoActions['connect'], Context> {
  return async () => {
    try {
      const utxoInstance = instance();

      if (!utxoInstance) {
        throw new Hub3Error(
          'PROVIDER_UNEXPECTED',
          'Do your wallet injected correctly and is utxo compatible?'
        );
      }
      const accounts = await utxoInstance.requestAccounts();

      return utils.formatAccountsToCAIP(accounts, CAIP_BITCOIN_CHAIN_ID);
    } catch (error) {
      if (error instanceof Hub3Error) {
        throw error;
      }
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === BITGET_UTXO_REJECTION_CODE &&
        'message' in error &&
        error.message === BITGET_UTXO_REJECTION_MESSAGE
      ) {
        throw new Hub3Error(
          'PROVIDER_USER_REJECTED_REQUEST',
          getErrorMessage(error),
          { cause: error }
        );
      }
      throw error;
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
