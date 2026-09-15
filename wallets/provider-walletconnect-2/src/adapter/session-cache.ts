import type { WalletConnectNamespace } from '../types.js';
import type { SessionTypes } from '@walletconnect/types';

export type SessionCache = {
  get(namespace: WalletConnectNamespace): SessionTypes.Struct | null;
  set(namespace: WalletConnectNamespace, session: SessionTypes.Struct): void;
  clear(namespace: WalletConnectNamespace): void;
  /**
   * Drops every namespace holding `topic`. A wallet may approve more than was
   * proposed, so one settled session can back both namespaces - tearing its topic
   * down under one of them would otherwise leave the other pointing at a topic
   * the relay has already dropped.
   */
  clearTopic(topic: string): void;
  clearAll(): void;
};

export function createSessionCache(): SessionCache {
  const sessions = new Map<WalletConnectNamespace, SessionTypes.Struct>();

  return {
    get: (namespace) => sessions.get(namespace) ?? null,

    set: (namespace, session) => void sessions.set(namespace, session),

    clear: (namespace) => void sessions.delete(namespace),

    clearTopic: (topic) => {
      for (const [namespace, session] of sessions) {
        if (session.topic === topic) {
          sessions.delete(namespace);
        }
      }
    },

    clearAll: () => sessions.clear(),
  };
}
