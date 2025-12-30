import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';
import type { TonConnectUI } from '@tonconnect/ui';

import { actions as commonActions } from '@rango-dev/wallets-core/namespaces/common';
import {
  type TonActions,
  type ProviderAPI as TonProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/ton';

import { getTonConnectUIModule, waitForConnection } from '../utils.js';

export function connect(
  getInstance: () => TonConnectUI
): FunctionWithContext<TonActions['connect'], Context> {
  return async () => {
    const tonInstance = getInstance();
    const connectionRestored = await tonInstance.connectionRestored;
    const { toUserFriendlyAddress } = await getTonConnectUIModule();
    let userFriendlyAddress: string;

    if (connectionRestored && tonInstance.account?.address) {
      userFriendlyAddress = toUserFriendlyAddress(tonInstance.account.address);
    } else {
      await tonInstance.openModal();
      const result = await waitForConnection(tonInstance);
      userFriendlyAddress = toUserFriendlyAddress(result);
    }

    return utils.formatAccountsToCAIP([userFriendlyAddress]);
  };
}

export function disconnect(
  getInstance: () => TonProviderAPI
): FunctionWithContext<TonActions['disconnect'], Context> {
  return async (context) => {
    const tonInstance = getInstance();
    if (tonInstance.connected) {
      await tonInstance.disconnect();
    }
    commonActions.disconnect(context);
  };
}

export function canEagerConnect(
  getInstance: () => TonProviderAPI
): FunctionWithContext<TonActions['canEagerConnect'], Context> {
  return async () => {
    const tonConnectUI = getInstance() as TonConnectUI;
    const connectionRestored = await tonConnectUI.connectionRestored;
    return connectionRestored;
  };
}

export const tonActions = { connect, disconnect, canEagerConnect };
