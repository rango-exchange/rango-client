import type { WalletStandardSolanaInstance } from '../types.js';
import type { Context, FunctionWithContext } from '@hub3js/core';

import {
  EIP1193_USER_REJECTED_REQUEST,
  getErrorMessage,
  Hub3Error,
} from '@hub3js/core';
import { type SolanaActions, utils } from '@hub3js/solana';

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
      // MetaMask's Solana wallet nests the EIP-1193 rejection code in `cause`.
      if (
        typeof error === 'object' &&
        error !== null &&
        'cause' in error &&
        typeof error.cause === 'object' &&
        error.cause !== null &&
        'code' in error.cause &&
        error.cause.code === EIP1193_USER_REJECTED_REQUEST
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
