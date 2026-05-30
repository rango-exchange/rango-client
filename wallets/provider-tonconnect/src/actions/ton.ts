import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';
import type { TonConnectUI } from '@tonconnect/ui';

import { type TonActions, utils } from '@rango-dev/wallets-core/namespaces/ton';

import { tonConnect } from '../utils.js';

export function connect(
  getInstance: () => TonConnectUI
): FunctionWithContext<TonActions['connect'], Context> {
  return async () => {
    const tonInstance = getInstance();
    const connectionRestored = await tonInstance.connectionRestored;
    const { toUserFriendlyAddress } = tonConnect.getModule();
    let userFriendlyAddress: string;

    if (connectionRestored && tonInstance.account?.address) {
      userFriendlyAddress = toUserFriendlyAddress(tonInstance.account.address);
    } else {
      await tonInstance.openModal();
      const result = await tonConnect.waitForConnection();
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
