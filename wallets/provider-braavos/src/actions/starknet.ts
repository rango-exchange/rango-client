import type { Context, FunctionWithContext } from '@hub3js/core';

import {
  CAIP_STARKNET_CHAIN_ID,
  type ProviderAPI,
  type StarknetActions,
  utils,
} from '@hub3js/starknet';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<StarknetActions['connect'], Context> {
  return async () => {
    try {
      const starknetInstance = instance();

      const connectResult = await starknetInstance?.enable();
      if (
        !connectResult ||
        !starknetInstance.isConnected ||
        !connectResult?.length
      ) {
        throw new Error('Error during connection');
      }
      if (
        starknetInstance?.chainId &&
        starknetInstance.chainId !== CAIP_STARKNET_CHAIN_ID
      ) {
        throw new Error(
          `Please switch to Mainnet, current network is ${starknetInstance?.chainId}`
        );
      }

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
export const starknetActions = { connect };
