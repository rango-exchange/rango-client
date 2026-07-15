import type { SignClientInstance, WalletConnectNamespace } from '../types.js';
import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type UniversalProvider from '@walletconnect/universal-provider';

import { debug } from '@rango-dev/logging-core';
import { getSdkError } from '@walletconnect/utils';

import { NAMESPACES } from '../wcConstants.js';

import { persistCurrentChainId } from './chain-state.js';
import { getSessionNamespace } from './lookup.js';

function isNoMatchingKeyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('No matching key');
}

export function hasActiveSession(client: ISignClient, topic: string): boolean {
  try {
    return !!client.session.get(topic);
  } catch {
    return false;
  }
}

export function hasActivePairing(
  client: SignClientInstance,
  topic: string
): boolean {
  return client.pairing.getAll().some((pairing) => pairing.topic === topic);
}

export async function expireWalletConnectTopic(
  client: SignClientInstance,
  topic: string
) {
  const sessions = client.session.getAll();
  const pairings = client.pairing.getAll();

  sessions.forEach((session: SessionTypes.Struct) => {
    if (session.topic === topic || session.pairingTopic === topic) {
      const requestForDeleteTopic =
        session.pairingTopic === topic ? session.pairingTopic : session.topic;
      client.core.expirer.set(requestForDeleteTopic, 0);
    }
  });

  pairings.forEach((pairing) => {
    if (pairing.topic === topic) {
      client.core.expirer.set(topic, 0);
    }
  });
}

export async function removeSessionRecord(
  client: SignClientInstance,
  session: SessionTypes.Struct
) {
  const namespace = getSessionNamespace(session);
  const pairingTopic = session.pairingTopic;

  if (hasActiveSession(client, session.topic)) {
    try {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } catch (error) {
      debug(error instanceof Error ? error : new Error(String(error)));
      if (isNoMatchingKeyError(error)) {
        await expireWalletConnectTopic(client, session.topic);
      }
    }
  } else {
    await expireWalletConnectTopic(client, session.topic);
  }

  const remainingOnPairing = client.session
    .getAll()
    .filter((item) => item.pairingTopic === pairingTopic);

  if (!remainingOnPairing.length && pairingTopic) {
    if (hasActivePairing(client, pairingTopic)) {
      try {
        await client.disconnect({
          topic: pairingTopic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
      } catch (error) {
        debug(error instanceof Error ? error : new Error(String(error)));
        if (isNoMatchingKeyError(error)) {
          await expireWalletConnectTopic(client, pairingTopic);
        }
      }
    } else {
      await expireWalletConnectTopic(client, pairingTopic);
    }
  }

  if (namespace === 'evm') {
    void persistCurrentChainId(client, undefined);
  }
}

export async function purgeOrphanedSessions(
  client: SignClientInstance
): Promise<void> {
  const pairingTopics = new Set(
    client.pairing.getAll().map((pairing) => pairing.topic)
  );

  for (const session of [...client.session.getAll()]) {
    const pairingOrphaned =
      !!session.pairingTopic && !pairingTopics.has(session.pairingTopic);
    const sessionMissing = !hasActiveSession(client, session.topic);

    if (pairingOrphaned || sessionMissing) {
      await removeSessionRecord(client, session);
    }
  }
}

/**
 * Drops pairings that no session is using.
 *
 * The inverse of {@link purgeOrphanedSessions}, and the only thing that collects
 * them: a cancelled connect leaves behind the pairing `client.connect()` minted,
 * and `cleanupPendingPairings` only unsubscribes pairings - it never deletes the
 * record. Without this they accumulate in `client.pairing` and in storage for the
 * lifetime of the origin.
 *
 * Only safe to call while no connect is in flight (the adapter's `#sessionQueue`
 * guarantees that): a pairing awaiting its first approval has no session yet, so
 * dropping it would kill that handshake.
 */
export async function purgeOrphanedPairings(
  client: SignClientInstance
): Promise<void> {
  const usedPairingTopics = new Set(
    client.session
      .getAll()
      .map((session) => session.pairingTopic)
      .filter((topic): topic is string => !!topic)
  );

  for (const pairing of [...client.pairing.getAll()]) {
    if (usedPairingTopics.has(pairing.topic)) {
      continue;
    }

    try {
      await client.disconnect({
        topic: pairing.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } catch (error) {
      debug(error instanceof Error ? error : new Error(String(error)));
      await expireWalletConnectTopic(client, pairing.topic);
    }
  }
}

export async function cleanupStaleSessionsForNamespace(
  client: UniversalProvider['client'],
  namespace: WalletConnectNamespace
): Promise<void> {
  for (const existing of client.session.getAll()) {
    if (getSessionNamespace(existing) !== namespace) {
      continue;
    }

    const btc = existing.namespaces[NAMESPACES.BITCOIN];
    if (
      btc &&
      (btc.chains?.length ?? 0) > 0 &&
      (btc.accounts?.length ?? 0) === 0
    ) {
      await removeSessionRecord(client, existing);
    }
  }
}
