import type { WalletStandardSolanaInstance } from '../types.js';
import type { Context, FunctionWithContext } from '@hub3js/core';

import { type SolanaActions, utils } from '@hub3js/solana';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

function connect(
  getInstance: () => WalletStandardSolanaInstance
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    try {
      const solanaInstance = getInstance();
      const connectResult = await solanaInstance.features[
        'standard:connect'
      ].connect();
      return utils.formatAccountsToCAIP(
        connectResult.accounts.map((account) => account.address)
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
function canEagerConnect(getInstance: () => WalletStandardSolanaInstance) {
  return async () => {
    const solanaInstance = getInstance();

    if (!solanaInstance) {
      throw new Error(
        'Trying to eagerly connect to your Solana wallet, but it seems that its instance is not available.'
      );
    }

    try {
      const result = await solanaInstance.features['standard:connect'].connect({
        silent: true,
      });
      return !!result.accounts.length;
    } catch {
      return false;
    }
  };
}
export const solanaActions = { connect, canEagerConnect };
