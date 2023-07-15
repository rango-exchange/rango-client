import { AccountId } from 'caip';
import { Networks, timeout } from '@rango-dev/wallets-shared';
import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import {
  PairingTypes,
  SessionTypes,
  SignClientTypes,
} from '@walletconnect/types';
import { Web3Modal } from '@web3modal/standalone';
import { getSdkError } from '@walletconnect/utils';

import {
  generateOptionalNamespace,
  generateRequiredNamespace,
  solanaChainIdToNetworkName,
} from './helpers';
import { PING_TIMEOUT, PROJECT_ID } from './constants';
import { ConnectParams, CreateSessionParams, WCInstance } from './types';

/**
 * Create a Web3Modal instance
 */
const web3Modal = new Web3Modal({
  projectId: PROJECT_ID,
  themeMode: 'light',
  walletConnectVersion: 2,
});

export function getLastSession(client: SignClient) {
  return client.session.values[client.session.values.length - 1];
}

/**
 *
 * Try to ping the wallet, if wallet responded with `pong`, session is a valid and we will use the session.
 * If the wallet didn't respond during 10 seconds (PING_TIME), we assume the wallet isn't available and we need to create a new session.
 *
 */
export async function restoreSession(
  client: SignClient,
  pairing: PairingTypes.Struct
): Promise<SessionTypes.Struct | undefined> {
  await timeout(
    client.ping({
      topic: pairing.topic,
    }),
    PING_TIMEOUT
  );

  // We assume last session is the correct session, beacuse we are doing clean up and keeps only one pairing/session.
  const session = getLastSession(client);
  return session;
}

/**
 *
 * Getting a  pair of required and optional namespaces then tries to show a modal and connect (pair)
 * To the wallet.
 * @param client
 * @param options
 * @returns
 */
export async function createSession(
  client: SignClient,
  options: CreateSessionParams
): Promise<SessionTypes.Struct> {
  const { requiredNamespaces, optionalNamespaces, pairingTopic } = options;

  try {
    const { uri, approval } = await client.connect({
      requiredNamespaces,
      optionalNamespaces,
      pairingTopic,
    });

    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    if (uri) {
      // Create a flat array of all requested chains across namespaces.
      const allNamespaces = {
        ...(requiredNamespaces || {}),
        ...(optionalNamespaces || {}),
      };

      const standaloneChains = Object.values(allNamespaces)
        .map((namespace) => namespace.chains)
        .flat() as string[];

      web3Modal.openModal({ uri, standaloneChains });
    }

    const session = await approval();
    return session;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    web3Modal.closeModal();
  }
}

/**
 *
 * A user (client) can have multiple pairings (to different wallets), we are assuming
 * the last pairing is the active pairing for now. A better UX can be showing a list of pairings
 * and let the user to choose the right pairing manually. Because we don't have that yet, we will pick up the last one.
 *
 */
export function tryGetPairing(
  client: SignClient
): PairingTypes.Struct | undefined {
  const pairings = client.pairing.getAll({ active: true });
  const lastPairing =
    pairings.length > 0 ? pairings[pairings.length - 1] : undefined;

  return lastPairing;
}

/**
 *
 * Try to restore the session first, if couldn't, create a new session by showing a modal.
 *
 */
export async function tryConnect(
  client: SignClient,
  params: ConnectParams
): Promise<SessionTypes.Struct> {
  const { network, meta } = params;

  const requiredNamespaces = generateRequiredNamespace(meta, network);
  /**
   * We try to get all of our supported chains as optional.
   * Currently, it only works on Trust Wallet (Note: the response is buggy and only returns eip155 optional namespaces).
   */
  const optionalNamespaces = generateOptionalNamespace(meta);

  if (!requiredNamespaces) {
    throw new Error(`Couldn't generate required namespace for ${network}`);
  }

  // Check if the user has a session, if yes, restore the session and use it.
  let session: SessionTypes.Struct | undefined;
  const pairing = tryGetPairing(client);
  if (pairing) {
    try {
      session = await restoreSession(client, pairing);
    } catch (e) {
      await disconnectSessions(client);
    }
  }

  // In case of connecting for the first time or session couldn't be restored, we will create a new session.
  if (!session) {
    session = await createSession(client, {
      requiredNamespaces,
      optionalNamespaces,
    });
  }

  return session;
}

/**
 * Wallet connect is a multichain protocol and we can not determine the connected wallet
 * supports which wallet, `extend`ing session doesn't work during a bug in their utils packages.
 * So we will try to make a new session with `network` that user needs to switch.
 */
export async function trySwitchByCreatingNewSession(
  instance: WCInstance,
  params: ConnectParams
): Promise<SessionTypes.Struct> {
  const { client, session } = instance;
  const { network, meta } = params;

  if (!session) {
    throw new Error(
      'For switching network, you need to have an active session!'
    );
  }

  // If a session has the chain id in its namespace, we can use that session.
  const requestedSession = getSessionByChainId(client, network);
  if (requestedSession) {
    return requestedSession;
  }

  // Creating a new session for requested network.
  const requiredNamespaces = generateRequiredNamespace(meta, network);
  if (!requiredNamespaces) {
    throw new Error(`Couldn't generate requiredNamespaces for ${network}`);
  }

  const createdSession = await createSession(client, { requiredNamespaces });

  return createdSession;
}

/**
 *
 * Looking for a chainId in sessions and return the session if found.
 *
 */
function getSessionByChainId(
  client: WCInstance['client'],
  chainId: string
): SessionTypes.Struct | undefined {
  const sessions = client.session.getAll();
  const requestedSession = sessions.find((session) => {
    const accounts = getAccountsFromSession(session);
    return accounts.find((account) => account.chainId === chainId);
  });

  return requestedSession;
}

/**
 *
 * Try to find sessions with a topic id and expire them.
 *
 */
export async function cleanupSingleSession(client: SignClient, topic: string) {
  const sessions = client.session.getAll();
  const pairings = client.pairing.getAll();

  sessions.forEach((session) => {
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

/**
 *
 * Disconnect means to delete the session on both parties (dApp & wallet) at the same time.
 *
 */
export async function disconnectSessions(client: SignClient) {
  const allPromises = [];

  const sessions = client.session.getAll();
  for (const session of sessions) {
    allPromises.push(
      client.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      })
    );
  }

  const pairings = client.pairing.getAll();
  for (const pairing of pairings) {
    allPromises.push(
      client.disconnect({
        topic: pairing.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      })
    );
  }

  return await Promise.all(allPromises);
}

export function getAccountsFromSession(session: SessionTypes.Struct) {
  const accounts = Object.values(session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      // Note: Solana has a specific ID, we need to convert it back to network name.
      // It will return the chain id itslef if it's not that specific ID.
      const chain = solanaChainIdToNetworkName(chainId.reference);
      return {
        accounts: [address],
        chainId: chain,
      };
    });

  return accounts;
}

export function getAccountsFromEvent(
  event: SignClientTypes.BaseEventArgs<{
    namespaces: SessionTypes.Namespaces;
  }>
) {
  const accounts = Object.values(event.params.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      return {
        accounts: [address],
        chainId:
          chainId.namespace === 'solana' ? Networks.SOLANA : chainId.reference,
      };
    });

  return accounts;
}
