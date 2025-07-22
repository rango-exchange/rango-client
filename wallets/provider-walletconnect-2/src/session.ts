import type {
  ConnectParams,
  CreateSessionParams,
  Environments,
} from './types.js';
import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type {
  PairingTypes,
  SessionTypes,
  SignClientTypes,
} from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import { Networks, timeout } from '@arlert-dev/wallets-shared';
import { getSdkError } from '@walletconnect/utils';
import { AccountId } from 'caip';

import { CHAIN_ID_STORAGE, PING_TIMEOUT } from './constants.js';
import {
  generateOptionalNamespace,
  getCurrentEvmAccountAddress,
  getEvmAccount,
  getModal,
  solanaChainIdToNetworkName,
} from './helpers.js';

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
  pairingTopic: PairingTypes.Struct['topic']
): Promise<SessionTypes.Struct | undefined> {
  await timeout(
    client.ping({
      topic: pairingTopic,
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

    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    let onCloseModal;
    if (uri) {
      /*
       * There are some wallets have been listed in WC itself (https://docs.walletconnect.com/cloud/explorer-submission),
       * Using `DISABLE_MODAL_AND_OPEN_LINK` option, we can directly open a specific desktop wallet.
       */
      const redirectLink = configs.envs.DISABLE_MODAL_AND_OPEN_LINK;
      if (redirectLink) {
        const url = `${redirectLink}/wc?uri=${encodeURIComponent(uri)}`;
        window.open(url, '_blank', 'noreferrer noopener');
      } else {
        // Create a flat array of all requested chains across namespaces.
        const allNamespaces = {
          ...(requiredNamespaces || {}),
          ...(optionalNamespaces || {}),
        };

        const standaloneChains = Object.values(allNamespaces)
          .map((namespace) => namespace.chains)
          .flat() as string[];

        const modal = getModal();
        void modal.openModal({ uri, chains: standaloneChains });

        onCloseModal = new Promise((_, reject) => {
          modal.subscribeModal((state) => {
            // the modal was closed so reject the promise
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
      // We know onClose only reject a modal and never returns a value.
      return result as SessionTypes.Struct;
    }
    return await session;
  } finally {
    getModal().closeModal();
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
  const { meta } = params;

  // We try to get all of our supported chains as optional.
  const optionalNamespaces = generateOptionalNamespace(meta);

  // Check if the user has a session, if yes, restore the session and use it.
  let session: SessionTypes.Struct | undefined;
  const pairing = tryGetPairing(client);
  if (pairing) {
    try {
      session = await restoreSession(client, pairing.topic);
    } catch (e) {
      await disconnectSessions(client);
    }
  }

  // In case of connecting for the first time or session couldn't be restored, we will create a new session.
  if (!session) {
    session = await createSession(
      client,
      {
        requiredNamespaces: {},
        optionalNamespaces,
      },
      {
        envs: params.envs,
      }
    );
  }

  return session;
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

  // reset the current chain id
  void persistCurrentChainId(client, undefined);

  return await Promise.all(allPromises);
}

export function getAccountsFromSession(session: SessionTypes.Struct) {
  const accounts = Object.values(session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      /*
       * Note: Solana has a specific ID, we need to convert it back to network name.
       * It will return the chain id itslef if it's not that specific ID.
       */
      const chain = solanaChainIdToNetworkName(chainId.reference);
      return {
        address,
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

/*
 * Before switch network, we need to update session namespace accounts
 * to contain both current chain and target chain accoutns.
 */
export async function updateSessionAccounts(
  instance: any,
  requestedNetwork: string,
  currentNetwork: string,
  meta: BlockchainMeta[]
) {
  const session = instance.session;

  const namespaces = session.namespaces;
  let needUpdateNamepspace = false;
  const accounts = namespaces.eip155.accounts;

  const currentAccountAddress = getCurrentEvmAccountAddress(instance);
  const requestedAccount = getEvmAccount(
    requestedNetwork,
    currentAccountAddress,
    meta
  );
  if (!accounts.includes(requestedAccount)) {
    accounts.push(requestedAccount);
    needUpdateNamepspace = true;
  }

  const currentAccount = getEvmAccount(
    currentNetwork,
    currentAccountAddress,
    meta
  );
  if (!accounts.includes(currentAccount)) {
    accounts.push(currentAccount);
    needUpdateNamepspace = true;
  }

  if (needUpdateNamepspace) {
    const updatedNamespaces = {
      ...namespaces,
      eip155: {
        ...namespaces.eip155,
        accounts,
      },
    };
    await instance.client.session
      .update({
        topic: session.topic,
        namespaces: updatedNamespaces,
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }
}

/*
 * Certain wallets, such as Trust Wallet and 1inch, are providing incorrect methods in
 * response to session proposal requests. These wallets do not support certain optional
 * RPC methods like "wallet_xyz," but they include them in the response under the session namespace.
 * For the time being, we should avoid their session namespace response.
 * see also: https://github.com/trustwallet/wallet-core/issues/3588
 */
export function ignoreNamespaceMethods(instance: any): boolean {
  const WALLETS_WITH_WRONG_NAMESPACE_METHODS = ['trust', '1inch'];
  const peerName = instance?.session?.peer?.metadata?.name;
  return WALLETS_WITH_WRONG_NAMESPACE_METHODS.some((name) =>
    peerName?.toLowerCase()?.includes(name)
  );
}

export async function persistCurrentChainId(
  client: SignClient,
  chainId?: string
) {
  return client.core.storage.setItem(CHAIN_ID_STORAGE, {
    defaultChainId: chainId ? parseInt(chainId) : '',
  });
}

/*
 * get the latest chain id from the storage,
 * used for setting current chain id in session reconnect.
 */
export async function getPersistedChainId(client: SignClient) {
  try {
    const chainId = (await client.core.storage.getItem(CHAIN_ID_STORAGE))
      ?.defaultChainId;
    return !!chainId ? String(chainId) : undefined;
  } catch {
    return undefined;
  }
}
