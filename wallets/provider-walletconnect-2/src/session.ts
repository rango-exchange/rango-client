import { AccountId } from 'caip';
import { Networks, timeout } from '@rango-dev/wallets-shared';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import {
  PairingTypes,
  ProposalTypes,
  SessionTypes,
} from '@walletconnect/types';
import { Web3Modal } from '@web3modal/standalone';
import { BlockchainMeta } from 'rango-types/lib';
import {
  // generateOptionalNamespace,
  generateRequiredNamespace,
  getChainId,
  PROJECT_ID,
} from './helpers';

const PING_TIMEOUT = 10_000;

/**
 * Web3Modal Config
 */
const web3Modal = new Web3Modal({
  projectId: PROJECT_ID,
  themeMode: 'light',
  walletConnectVersion: 2,
});

function getLastSession(client: SignClient) {
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
    network || Networks.ETHEREUM
  );
  // Otherwise we try to get all of them as optional
  // const optionalNamespaces = generateOptionalNamespace(meta);

  if (!requiredNamespaces) {
    console.log({
      requiredNamespaces,
      a: {
        meta,
        network: network || Networks.ETHEREUM,
      },
    });
    throw new Error(`Couldn't generate required namespace for ${network}`);
  }

  let session: SessionTypes.Struct | undefined;
  console.log({ client });
  const pairing = tryGetPairing(client);
  if (pairing) {
    console.log(`Trying to restore ${pairing.peerMetadata?.name} pair.`);
    try {
      session = await restoreSession(client, pairing);
    } catch (e) {
      await cleanupSessions(client);
      console.log("Couldn't restore session:", e);
    }
  }

  // Connecting for the first time
  // or session couldn't be restored.
  if (!session) {
    session = await createSession(client, {
      requiredNamespaces,
      // optionalNamespaces,
    });
  }

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
        chainId: getChainId(chainId.toString()).toString(),
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
