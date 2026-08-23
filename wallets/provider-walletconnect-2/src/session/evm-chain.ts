import type { Chain } from '@hub3js/evm';
import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import { error as logError } from '@rango-dev/logging-core';
import { ChainId } from 'caip';

import {
  chainReferenceToHex,
  parseChainReference,
  resolveNetworkName,
} from '../utils.js';
import { EthereumRPCMethods, NAMESPACES } from '../wcConstants.js';

import { getAccountsFromSession } from './accounts.js';
import { getPersistedChainId, persistCurrentChainId } from './chain-state.js';
import {
  filterEvmAccounts,
  ignoreNamespaceMethods,
  switchOrAddEvmChain,
  updateSessionAccounts,
} from './evm.js';

export type EvmChainDeps = {
  meta: BlockchainMeta[];
  getSession: (namespace: 'evm') => SessionTypes.Struct | null;
  cacheSession: (namespace: 'evm', session: SessionTypes.Struct) => void;
  getClient: () => Promise<ISignClient>;
  ensureSession: (options: {
    namespace: 'evm';
    chainReference?: string;
  }) => Promise<SessionTypes.Struct>;
};

export async function resolveActiveChainReference(
  client: ISignClient,
  session: SessionTypes.Struct
): Promise<string | undefined> {
  const persistedChainId = await getPersistedChainId(client);
  if (persistedChainId) {
    return persistedChainId;
  }

  const accounts = getAccountsFromSession(session);
  const evmAccounts = filterEvmAccounts(accounts);
  return evmAccounts[0]?.chainId;
}

export async function getCurrentChainId(
  client: ISignClient,
  session: SessionTypes.Struct
): Promise<`0x${string}`> {
  const reference = await resolveActiveChainReference(client, session);
  if (!reference) {
    throw new Error(
      'Unable to determine EVM chain id from WalletConnect session.'
    );
  }

  return chainReferenceToHex(reference);
}

/**
 * Returns the session to keep using: `updateSessionAccounts` may rebuild it, and
 * the caller's copy is stale from that point on.
 */
export async function switchEvmNetwork(options: {
  client: ISignClient;
  session: SessionTypes.Struct;
  meta: BlockchainMeta[];
  requestedChainId: string;
  currentChainId: string;
}): Promise<SessionTypes.Struct> {
  const { client, session, meta, requestedChainId, currentChainId } = options;

  const requestedReference = parseChainReference(requestedChainId);
  if (!requestedReference) {
    const error = new Error(`There is no match for ${requestedChainId}`);
    logError(error);
    throw error;
  }

  const chainIdStr = new ChainId({
    namespace: NAMESPACES.ETHEREUM,
    reference: requestedReference,
  }).toString();

  const requestedNetwork = resolveNetworkName(requestedChainId, meta);
  const currentNetwork = resolveNetworkName(currentChainId, meta);

  const evmNamespace = session.namespaces[NAMESPACES.ETHEREUM];
  const authorizedChains = evmNamespace?.chains || [];
  const authorizedMethods = evmNamespace?.methods || [];
  let activeSession = session;

  if (
    authorizedMethods.includes(EthereumRPCMethods.SWITCH_CHAIN) &&
    !ignoreNamespaceMethods(session)
  ) {
    if (!requestedNetwork || !currentNetwork) {
      const error = new Error(`Chain ${requestedReference} is not configured.`);
      logError(error);
      throw error;
    }

    activeSession = await updateSessionAccounts(
      client,
      session,
      requestedNetwork,
      currentNetwork,
      meta
    );
    await switchOrAddEvmChain(
      client,
      activeSession,
      meta,
      requestedNetwork,
      currentNetwork
    );
  } else if (!authorizedChains.includes(chainIdStr)) {
    const error = new Error(`Chain ${requestedReference} is not configured.`);
    logError(error);
    throw error;
  }

  await persistCurrentChainId(client, requestedReference);
  return activeSession;
}

export async function switchToChainIfNeeded(
  deps: EvmChainDeps,
  requestedReference: string
): Promise<void> {
  const session = deps.getSession('evm');
  if (!session) {
    throw new Error('WalletConnect session is not available.');
  }

  const client = await deps.getClient();
  const currentReference = await resolveActiveChainReference(client, session);
  if (currentReference === requestedReference) {
    await persistCurrentChainId(client, requestedReference);
    return;
  }

  const currentChainId = currentReference
    ? chainReferenceToHex(currentReference)
    : chainReferenceToHex(requestedReference);

  deps.cacheSession(
    'evm',
    await switchEvmNetwork({
      client,
      session,
      meta: deps.meta,
      requestedChainId: requestedReference,
      currentChainId,
    })
  );
}

export async function ensureConnectedToChain(
  deps: EvmChainDeps,
  chain?: string | Chain
): Promise<SessionTypes.Struct> {
  const requestedReference = chain ? parseChainReference(chain) : undefined;

  if (!deps.getSession('evm')) {
    await deps.ensureSession({
      namespace: 'evm',
      chainReference: requestedReference,
    });
  }

  if (requestedReference) {
    await switchToChainIfNeeded(deps, requestedReference);
  }

  const session = deps.getSession('evm');
  if (!session) {
    throw new Error('WalletConnect session is not available.');
  }

  return session;
}
