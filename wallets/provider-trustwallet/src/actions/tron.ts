import type { Context, FunctionWithContext } from '@hub3js/core';

import {
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';

import { TronOKRequestCode, TronUserRejectedCode } from '../constants.js';
import { tronTrustWallet } from '../utils.js';

export function connect(): FunctionWithContext<
  TronActions['connect'],
  Context
> {
  return async () => {
    const instance = tronTrustWallet();
    const result = await instance.request({ method: 'tron_requestAccounts' });

    /*
     * Any non-OK code carries a message to surface — except the user-rejection code
     * (4001), which Trust returns message-less, so we supply the message and keep the
     * code on the error (same shape as `standardizeTrustWalletInAppBrowserError`).
     */
    if (result.code !== TronOKRequestCode) {
      const fallbackMessage =
        result.code === TronUserRejectedCode
          ? 'User rejected the request'
          : 'Failed to connect to Trust Wallet.';
      const error = new Error(result.message ?? fallbackMessage) as Error & {
        code: number;
      };
      error.code = result.code;
      throw error;
    }

    return utils.formatAccountsToCAIP([instance.tronWeb.defaultAddress.base58]);
  };
}

export const tronActions = { connect };
