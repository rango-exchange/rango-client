import type { Context, FunctionWithContext } from '@hub3js/core';

import {
  type SolanaActions,
  type ProviderAPI as SolanaProviderApi,
  utils,
} from '@hub3js/solana';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

function connect(
  getInstance: () => SolanaProviderApi
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    try {
      const solanaInstance = getInstance();
      const connectResult = await solanaInstance.connect();
      return utils.formatAccountsToCAIP(connectResult);
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

export const solanaActions = { connect };
