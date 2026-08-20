import type { WalletConnectNamespace } from '../types.js';
import type { SessionTypes } from '@walletconnect/types';

import { getSessionNamespace } from '../session/lookup.js';

export type SessionCache = {
  get(namespace: WalletConnectNamespace): SessionTypes.Struct | null;
  set(session: SessionTypes.Struct): void;
  clear(namespace: WalletConnectNamespace): void;
  clearAll(): void;
};

export function createSessionCache(): SessionCache {
  const sessions = new Map<WalletConnectNamespace, SessionTypes.Struct>();

  return {
    get: (namespace) => sessions.get(namespace) ?? null,

    set: (session) => {
      const namespace = getSessionNamespace(session);
      if (!namespace) {
        throw new Error(
          'Cannot cache session: unable to determine its namespace.'
        );
      }
      sessions.set(namespace, session);
    },

    clear: (namespace) => void sessions.delete(namespace),

    clearAll: () => sessions.clear(),
  };
}
