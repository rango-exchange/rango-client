import type {
  TonConnectEvent,
  TonProviderApi,
} from '../namespaces/ton/types.js';
import type { Context, FunctionWithContext } from '@hub3js/core';

import { type TonActions } from '@rango-dev/wallets-core/namespaces/ton';

import {
  TON_CONNECT_PROTOCOL_VERSION,
  TON_CONNECT_USER_REJECTED_CODE,
} from '../constants.js';
import {
  connectEventToCAIP,
  getTonConnectManifestUrl,
  isTonConnectEventSuccess,
  nextTonRequestId,
} from '../namespaces/ton/utils.js';

export function connect(
  getInstance: () => TonProviderApi
): FunctionWithContext<TonActions['connect'], Context> {
  return async () => {
    const instance = getInstance();

    /*
     * If the dApp was approved before, `restoreConnection` resolves the current
     * session without prompting the user; otherwise fall back to a fresh
     * connect request.
     */
    let connectEvent: TonConnectEvent | undefined;
    try {
      connectEvent = await instance.restoreConnection();
    } catch {
      // No restorable session; a fresh connect request is made below.
    }

    if (!connectEvent || !isTonConnectEventSuccess(connectEvent)) {
      connectEvent = await instance.connect(TON_CONNECT_PROTOCOL_VERSION, {
        manifestUrl: getTonConnectManifestUrl(),
        items: [{ name: 'ton_addr' }],
      });
    }

    if (!isTonConnectEventSuccess(connectEvent)) {
      // The bridge reports a user-cancelled prompt as a `connect_error` event.
      if (connectEvent.payload.code === TON_CONNECT_USER_REJECTED_CODE) {
        throw new Error('User rejected the request.');
      }
      throw new Error(
        `Couldn't connect to OKX TON. code: ${connectEvent.payload.code}, message: ${connectEvent.payload.message}`
      );
    }

    const accounts = await connectEventToCAIP(connectEvent);
    if (!accounts.length) {
      throw new Error("Couldn't find any TON address!");
    }

    return accounts;
  };
}

export function canEagerConnect(
  getInstance: () => TonProviderApi
): FunctionWithContext<TonActions['canEagerConnect'], Context> {
  return async () => {
    /*
     * Auto connect may run this before the wallet is injected; it should never
     * throw.
     */
    try {
      const connectEvent = await getInstance().restoreConnection();
      return isTonConnectEventSuccess(connectEvent);
    } catch {
      return false;
    }
  };
}

export function disconnect(getInstance: () => TonProviderApi) {
  return async () => {
    /*
     * Revoking the session on the wallet side is best effort; local state
     * cleanup should proceed even if it fails.
     */
    try {
      await getInstance().send({
        method: 'disconnect',
        params: [],
        id: nextTonRequestId(),
      });
    } catch {
      // ignore
    }
  };
}

export const tonActions = { connect, canEagerConnect, disconnect };
