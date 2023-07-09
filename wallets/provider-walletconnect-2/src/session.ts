import { AccountId, ChainId } from 'caip';
import { Networks, timeout } from '@rango-dev/wallets-shared';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import {
  PairingTypes,
  ProposalTypes,
  SessionTypes,
  SignClientTypes,
} from '@walletconnect/types';
import { Web3Modal } from '@web3modal/standalone';
import { BlockchainMeta, evmBlockchains } from 'rango-types/lib';
import {
  // generateOptionalNamespace,
  generateRequiredNamespace,
} from './helpers';
import { PROJECT_ID } from './constants';
import { Instance } from '.';

const PING_TIMEOUT = 10_000;

/**
 * Web3Modal Config
 */
const web3Modal = new Web3Modal({
  projectId: PROJECT_ID,
  themeMode: 'light',
  walletConnectVersion: 2,
});

export function getLastSession(client: SignClient) {
  return client.session.values[client.session.values.length - 1];
}

export async function restoreSession(
  client: SignClient,
  pairing: PairingTypes.Struct
): Promise<SessionTypes.Struct | undefined> {
  console.log('trying to ping');
  await timeout(
    client.ping({
      topic: pairing.topic,
    }),
    PING_TIMEOUT
  );

  console.log('calling connect() after pong');
  await client.connect({
    pairingTopic: pairing.topic,
  });

  // We assume last session is the correct session, beacuse we are doing clean up and keeps only one pairing/session.
  const session = getLastSession(client);
  console.log('caleed connect(),', session, client.session, pairing.topic);

  return session;
}

export async function createSession(
  client: SignClient,
  {
    requiredNamespaces,
    optionalNamespaces,
  }: {
    requiredNamespaces: ProposalTypes.RequiredNamespaces;
    optionalNamespaces?: ProposalTypes.OptionalNamespaces;
  }
): Promise<SessionTypes.Struct> {
  try {
    const { uri, approval } = await client.connect({
      //   pairingTopic: pairing?.topic,
      requiredNamespaces,
      optionalNamespaces,
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
    console.log('Established session:', session);
    return session;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    // close modal in case it was open
    web3Modal.closeModal();
  }
}

export function tryGetPairing(
  client: SignClient
): PairingTypes.Struct | undefined {
  const pairings = client.pairing.getAll({ active: true });
  const lastPairing =
    pairings.length > 0 ? pairings[pairings.length - 1] : undefined;

  return lastPairing;
}

export async function tryConnect(
  client: SignClient,
  params: {
    network?: string;
    meta: BlockchainMeta[];
  }
): Promise<SessionTypes.Struct> {
  const { network, meta } = params;
  // If `network` is provided, trying to get chainId. Otherwise, fallback to eth.
  const requiredNamespaces = generateRequiredNamespace(
    meta,
    network || Networks.SOLANA
  );
  console.log({ requiredNamespaces, network });

  // Otherwise we try to get all of them as optional
  // const optionalNamespaces = generateOptionalNamespace(meta);

  if (!requiredNamespaces) {
    throw new Error(`Couldn't generate required namespace for ${network}`);
  }

  let session: SessionTypes.Struct | undefined;
  const pairing = tryGetPairing(client);
  console.log('[tryConnect]', { client, pairing });
  if (pairing) {
    console.log(`Trying to restore ${pairing.peerMetadata?.name} pair.`);
    try {
      session = await restoreSession(client, pairing);
    } catch (e) {
      await cleanupSessions(client);
      console.log("Couldn't restore session:", e);
    }
  }

  console.log('[tryConnect] check session', { session });

  // Connecting for the first time
  // or session couldn't be restored.
  if (!session) {
    session = await createSession(client, {
      requiredNamespaces,
      // optionalNamespaces,
    });
    console.log('[tryConnect] created session', { session });
  }

  return session;
}

export async function tryUpdate(
  instance: Instance,
  params: {
    network: string;
    meta: BlockchainMeta[];
  }
): Promise<SessionTypes.Struct> {
  const { client, session } = instance;
  const { network, meta } = params;

  if (!session) throw new Error('Session must exist!');
  console.log('[tryUpdate] ', { client, session });

  const sessions = client.session.getAll();
  const lastSession = sessions[sessions.length - 1];

  const evm = evmBlockchains(meta);
  const requiredEvmChain = evm.find((chain) => chain.name === network);
  if (!requiredEvmChain) throw new Error('not found!');

  console.log(
    '[tryUpdate] requiredEvmChain',
    lastSession,
    requiredEvmChain,
    session
  );

  const address = '0x2702d89c1c8658b49c45dd460deebcc45faec03c';
  const chainId = new ChainId({
    namespace: 'eip155',
    reference: String(parseInt(requiredEvmChain?.chainId)),
  }).toString();

  const newNamespace = lastSession.namespaces;
  newNamespace.eip155.accounts.push(
    new AccountId({
      chainId,
      address: address,
    }).toString()
  );
  newNamespace.eip155.chains?.push(chainId);

  console.log('[tryUpdate] else', {
    newNamespace,
  });

  client.update({
    topic: session.topic,
    namespaces: newNamespace,
  });

  console.log({ session });
  return session;
}

export async function disconnectFromTopic(client: SignClient, topic: string) {
  client.disconnect({
    topic: topic,
    reason: {
      code: 6000,
      message: 'User disconnected.',
    },
  });
}

export async function cleanupSessions(client: SignClient) {
  const pairings = client.pairing.getAll();

  for (const pairing of pairings) {
    client.core.expirer.set(pairing.topic, 0);
  }
}

export function getAccountsFromSession(session: SessionTypes.Struct) {
  const accounts = Object.values(session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      return {
        accounts: [address],
        chainId: chainId.reference,
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

export type JsonRpcFetchFunc = (
  method: string,
  params?: Array<any>
) => Promise<any>;

export function ethereumJsonRpcFetch(client: SignClient): JsonRpcFetchFunc {
  return async (method, params) => {
    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return [];
      case 'wallet_switchEthereumChain':
        return null;
      case 'eth_chainId':
        return 1;
      default:
        break;
    }

    const session = getLastSession(client);
    const chainId = `eip155:1`;

    if (session.namespaces['eip155']?.methods.includes(method)) {
      return await client.request({
        chainId,
        topic: session.topic,
        request: {
          method,
          params,
        },
      });
    }
    console.log(client, method, params);

    throw new Error(
      `Your should add ${method} to your 'methods' (for 'requiredNamesapce' or 'optionalNamespace').`
    );
  };
}
