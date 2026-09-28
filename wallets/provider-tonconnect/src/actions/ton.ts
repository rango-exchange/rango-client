import type { Context, FunctionWithContext } from '@hub3js/core';
import type { TonConnectUI } from '@tonconnect/ui';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { type TonActions, utils } from '@hub3js/tvm';

import { tonConnect } from '../utils.js';

export function connect(
  getInstance: () => TonConnectUI
): FunctionWithContext<TonActions['connect'], Context> {
  return async () => {
    try {
      const tonInstance = getInstance();
      const connectionRestored = await tonInstance.connectionRestored;
      const { toUserFriendlyAddress } = tonConnect.getModule();
      let userFriendlyAddress: string;

      if (connectionRestored && tonInstance.account?.address) {
        userFriendlyAddress = toUserFriendlyAddress(
          tonInstance.account.address
        );
      } else {
        await tonInstance.openModal();
        // Rejects with a rejected connection error when the user closes the modal.
        const result = await tonConnect.waitForConnection();
        userFriendlyAddress = toUserFriendlyAddress(result);
      }

      return utils.formatAccountsToCAIP([userFriendlyAddress]);
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
}

export function canEagerConnect(
  getInstance: () => TonConnectUI
): FunctionWithContext<TonActions['canEagerConnect'], Context> {
  return async () => {
    const tonConnectUI = getInstance();
    const connectionRestored = await tonConnectUI.connectionRestored;
    return connectionRestored;
  };
}

export const tonActions = { connect, canEagerConnect };
