import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { utils } from '@hub3js/tron';

import {
  TRON_OK_REQUEST_CODE,
  TRON_USER_REJECTION_CODE,
} from '../constants.js';
import { tronOKX } from '../utils.js';

const connect = async () => {
  try {
    const instance = tronOKX();
    const accountsResult = await instance.request({
      method: 'tron_requestAccounts',
    });

    if (accountsResult?.code && accountsResult.code !== TRON_OK_REQUEST_CODE) {
      if (accountsResult.code === TRON_USER_REJECTION_CODE) {
        throw new WalletConnectionError(
          getErrorMessage(accountsResult) ??
            CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
          { type: ConnectionErrorType.Rejected, cause: accountsResult }
        );
      }
      throw new Error(
        accountsResult.message ?? 'Failed to connect to OKX Wallet Tron.'
      );
    }
    return utils.formatAccountsToCAIP([instance.tronWeb.defaultAddress.base58]);
  } catch (error) {
    if (error instanceof WalletConnectionError) {
      throw error;
    }
    const type = isUserRejectionError(error)
      ? ConnectionErrorType.Rejected
      : ConnectionErrorType.Unknown;
    throw new WalletConnectionError(
      getErrorMessage(error) ?? CONNECTION_ERROR_MESSAGES[type],
      { type, cause: error }
    );
  }
};

/*
 * Wrapped in a try-catch in the case of wallet injection delay
 */
const canEagerConnect = async () => {
  try {
    const tronInstance = tronOKX();
    return !!tronInstance.ready;
  } catch {
    return false;
  }
};
export const tronActions = { connect, canEagerConnect };
