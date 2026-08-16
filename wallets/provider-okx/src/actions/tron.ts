import { utils } from '@rango-dev/wallets-core/namespaces/tron';

import {
  TRON_OK_REQUEST_CODE,
  TRON_USER_REJECTION_CODE,
} from '../constants.js';
import { tronOKX } from '../utils.js';

const connect = async () => {
  const instance = tronOKX();
  const accountsResult = await instance.request({
    method: 'tron_requestAccounts',
  });

  if (accountsResult?.code && accountsResult.code !== TRON_OK_REQUEST_CODE) {
    if (accountsResult.code === TRON_USER_REJECTION_CODE) {
      throw new Error('User rejected the request.');
    }
    throw new Error(
      accountsResult.message ?? 'Failed to connect to OKX Wallet Tron.'
    );
  }
  return utils.formatAccountsToCAIP([instance.tronWeb.defaultAddress.base58]);
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
