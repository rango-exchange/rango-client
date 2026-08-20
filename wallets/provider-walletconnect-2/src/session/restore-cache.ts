import type { SessionCache } from '../adapter/session-cache.js';
import type { SignClientInstance, WalletConnectNamespace } from '../types.js';
import type { SessionTypes } from '@walletconnect/types';

import { debug } from '@rango-dev/logging-core';

import {
  restoreWalletConnectSession,
  type RestoreWalletConnectSessionOptions,
} from './lifecycle.js';
import { disconnectWalletConnectSessions } from './teardown.js';

export async function restoreAndCacheSession(
  client: SignClientInstance,
  namespace: WalletConnectNamespace,
  cache: SessionCache,
  options?: RestoreWalletConnectSessionOptions,
  onDisconnect?: (namespace: WalletConnectNamespace) => Promise<void>
): Promise<SessionTypes.Struct | null> {
  try {
    const session = await restoreWalletConnectSession(
      client,
      namespace,
      options
    );
    if (!session) {
      return null;
    }

    await disconnectWalletConnectSessions(client, {
      type: 'otherNamespaces',
      namespace,
    }).catch((error) => debug(error));

    cache.set(session);
    return session;
  } catch (error) {
    debug(error instanceof Error ? error : new Error(String(error)));
    if (cache.get(namespace)) {
      await onDisconnect?.(namespace);
    }
    return null;
  }
}
