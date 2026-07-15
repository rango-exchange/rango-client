import type { AppKitModal } from '../adapter/modal.js';
import type {
  ConnectParams,
  CreateSessionParams,
  Environments,
  SignClientInstance,
  WalletConnectNamespace,
} from '../types.js';
import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type UniversalProvider from '@walletconnect/universal-provider';

import { debug } from '@rango-dev/logging-core';
import { timeout } from '@rango-dev/wallets-shared';

import { PING_TIMEOUT } from '../wcConstants.js';

import { getAccountsFromSession } from './accounts.js';
import { filterBip122Accounts, resolveBip122Session } from './bip122.js';
import { getPersistedChainId } from './chain-state.js';
import { filterEvmAccounts } from './evm.js';
import { findSessionByNamespace } from './lookup.js';
import {
  buildConnectNamespacePayload,
  generateOptionalNamespace,
} from './proposals.js';
import {
  cleanupStaleSessionsForNamespace,
  hasActivePairing,
  hasActiveSession,
  purgeOrphanedSessions,
  removeSessionRecord,
} from './teardown.js';

export type RestoreWalletConnectSessionOptions = {
  validateAccounts?: boolean;
};

export async function restoreWalletConnectSession(
  client: SignClientInstance,
  namespace: WalletConnectNamespace,
  options: RestoreWalletConnectSessionOptions = {}
): Promise<SessionTypes.Struct | undefined> {
  const session = await restoreNamespaceSession(client, namespace);
  if (!session) {
    return undefined;
  }

  /*
   * Never wait for `bip122_addressesChanged` here. The wallet only emits it just
   * after approval, so a stored session that still has no account will never be
   * given one - waiting would stall for the full timeout and fail anyway. Report
   * it as unrestorable instead and let the caller negotiate a fresh session.
   */
  if (namespace === 'utxo' && filterBip122Accounts(session).length === 0) {
    return undefined;
  }

  if (options.validateAccounts) {
    const isValid = await hasNamespaceAccounts(client, namespace, session);
    if (!isValid) {
      return undefined;
    }
  }

  return session;
}

async function hasNamespaceAccounts(
  client: SignClientInstance,
  namespace: WalletConnectNamespace,
  session: SessionTypes.Struct
): Promise<boolean> {
  if (namespace === 'utxo') {
    return filterBip122Accounts(session).length > 0;
  }

  const accounts = getAccountsFromSession(session);
  const currentChainId = await getPersistedChainId(client);
  return filterEvmAccounts(accounts, currentChainId).length > 0;
}

/**
 * Ping the session topic and return it if still valid.
 * Returns undefined (instead of throwing) when storage contains stale records.
 */
export async function restoreNamespaceSession(
  client: SignClientInstance,
  namespace: WalletConnectNamespace
): Promise<SessionTypes.Struct | undefined> {
  const session = findSessionByNamespace(client, namespace);
  if (!session?.topic) {
    return undefined;
  }

  if (!hasActiveSession(client, session.topic)) {
    await removeSessionRecord(client, session);
    return undefined;
  }

  if (session.pairingTopic && !hasActivePairing(client, session.pairingTopic)) {
    await removeSessionRecord(client, session);
    return undefined;
  }

  try {
    await timeout(
      client.ping({
        topic: session.topic,
      }),
      PING_TIMEOUT
    );
  } catch (error) {
    debug(error instanceof Error ? error : new Error(String(error)));
    await removeSessionRecord(client, session);
    return undefined;
  }

  return findSessionByNamespace(client, namespace) ?? session;
}

/**
 * Clears unusable records ahead of a connect: orphaned sessions across every
 * namespace, plus `namespace`'s own stale ones.
 *
 * A *live* session belonging to another namespace is deliberately left alone -
 * EVM and UTXO each own an independent session, and only the namespace being
 * disconnected drops its own.
 */
export async function prepareWalletConnectNamespace(
  client: UniversalProvider['client'],
  namespace: WalletConnectNamespace
): Promise<void> {
  await purgeOrphanedSessions(client);
  await cleanupStaleSessionsForNamespace(client, namespace);
}

/**
 * Restores `namespace`'s session, or negotiates a new one.
 *
 * Callers are expected to have run {@link prepareWalletConnectNamespace} first -
 * this does not clean up on its own.
 */
export async function connectWalletConnectSession(
  client: UniversalProvider['client'],
  web3Modal: AppKitModal,
  params: ConnectParams
): Promise<SessionTypes.Struct> {
  const { chains, namespace, chainReference } = params;

  const restored = await restoreWalletConnectSession(client, namespace);
  if (restored) {
    return restored;
  }

  const proposal = generateOptionalNamespace(
    chains,
    [namespace],
    chainReference
  );
  const connectNamespaces = buildConnectNamespacePayload(
    proposal,
    namespace,
    chainReference
  );

  const session = await createSession(client, web3Modal, connectNamespaces, {
    envs: params.envs,
  });

  /*
   * Only a just-approved session can be waited on: bitcoin wallets routinely
   * approve bip122 with no account and send it moments later. A restored session
   * never reaches here, so the wait can't be spent on one that will never
   * receive the event.
   */
  if (namespace === 'utxo') {
    return resolveBip122Session(client, session);
  }

  return session;
}

async function createSession(
  client: ISignClient,
  web3Modal: AppKitModal,
  options: CreateSessionParams,
  configs: {
    envs: Environments;
  }
): Promise<SessionTypes.Struct> {
  const { requiredNamespaces, optionalNamespaces, pairingTopic } = options;

  try {
    const { uri, approval } = await client.connect({
      requiredNamespaces,
      optionalNamespaces,
      pairingTopic,
    });

    let onCloseModal;
    if (uri) {
      const redirectLink = configs.envs.DISABLE_MODAL_AND_OPEN_LINK;
      if (redirectLink) {
        const url = `${redirectLink}/wc?uri=${encodeURIComponent(uri)}`;
        window.open(url, '_blank', 'noreferrer noopener');
      } else {
        const caipNamespace = (Object.keys(requiredNamespaces ?? {})[0] ??
          Object.keys(optionalNamespaces ?? {})[0]) as
          | 'eip155'
          | 'bip122'
          | undefined;
        await web3Modal.open({
          uri,
          ...(caipNamespace ? { namespace: caipNamespace } : {}),
        });

        onCloseModal = new Promise((_, reject) => {
          web3Modal.subscribeState((state) => {
            if (!state.open) {
              reject(new Error('Modal has been closed.'));
            }
          });
        });
      }
    }

    const session = approval();

    if (onCloseModal) {
      const result = await Promise.race([session, onCloseModal]);
      return result as SessionTypes.Struct;
    }
    return await session;
  } finally {
    void web3Modal.close();
  }
}
