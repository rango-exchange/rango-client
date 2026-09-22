import type { Context, FunctionWithContext } from '@hub3js/core';
import type { TonConnectUI } from '@tonconnect/ui';

import { TON_NAMESPACE } from '@hub3js/namespaces';
import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { type TonActions, utils } from '@hub3js/tvm';

import { WALLET_ID } from '../constants.js';
import { tonConnect } from '../utils.js';

export function connect(
  getInstance: () => TonConnectUI
): FunctionWithContext<TonActions['connect'], Context> {
  return async (context) => {
    const tonInstance = getInstance();
    const connectionRestored = await tonInstance.connectionRestored;
    const { toUserFriendlyAddress } = tonConnect.getModule();
    let userFriendlyAddress: string;

    if (connectionRestored && tonInstance.account?.address) {
      userFriendlyAddress = toUserFriendlyAddress(tonInstance.account.address);
    } else {
      await tonInstance.openModal();
      const result = await tonConnect.waitForConnection();
      if (!result) {
        const [getState] = context.state();
        const { accounts, ...state } = getState();
        throw new WalletConnectionError({
          walletType: WALLET_ID,
          namespace: TON_NAMESPACE,
          type: ConnectionErrorType.Rejected,
          state,
        });
      }
      userFriendlyAddress = toUserFriendlyAddress(result);
    }

    return utils.formatAccountsToCAIP([userFriendlyAddress]);
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
