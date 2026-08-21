import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import { debug } from '@rango-dev/logging-core';
import { convertEvmBlockchainMetaToEvmChainInfo } from '@rango-dev/wallets-blockchains';
import { AccountId, ChainId } from 'caip';
import { isAddress as isEvmAddress } from 'ethers';
import { isEvmBlockchain } from 'rango-types';

import { EthereumRPCMethods, NAMESPACES } from '../wcConstants.js';

import { getChainIdByNetworkName } from './chain-state.js';

export function getCurrentEvmAccountAddress(
  session: SessionTypes.Struct
): string | undefined {
  return session.namespaces[NAMESPACES.ETHEREUM]?.accounts
    ?.map((account) => new AccountId(account).address)
    ?.filter((address) => isEvmAddress(address))?.[0];
}

export function getEvmAccount(
  network: string,
  address: string,
  meta: BlockchainMeta[]
): string | undefined {
  const currentChainId = getChainIdByNetworkName(network, meta);
  if (!currentChainId) {
    return undefined;
  }

  return AccountId.format({
    chainId: {
      namespace: NAMESPACES.ETHEREUM,
      reference: currentChainId,
    },
    address,
  });
}

// It's enough to return only connected network for the EVM networks and ignore others
export function filterEvmAccounts(
  accounts: {
    address: string;
    chainId: string;
  }[],
  currentChainId?: string
) {
  let firstEvmAddress = false;
  return accounts
    .filter(({ address, chainId }) => {
      const isEvm = isEvmAddress(address);
      if (!isEvm) {
        return false;
      }
      if (currentChainId && chainId !== currentChainId) {
        return false;
      }
      if (!currentChainId) {
        if (firstEvmAddress) {
          return false;
        }
        firstEvmAddress = true;
      }
      return true;
    })
    .map(({ address, chainId }) => ({
      accounts: [address],
      chainId: chainId,
    }));
}

export async function switchOrAddEvmChain(
  client: ISignClient,
  session: SessionTypes.Struct,
  meta: BlockchainMeta[],
  requestedNetwork: string,
  currentNetwork: string
) {
  const evmBlockchains = meta.filter(isEvmBlockchain);
  const evmNetworksChainInfo =
    convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains);
  const targetChain = evmNetworksChainInfo[requestedNetwork];
  const targetBlockchain = meta.find(
    (blockchain: BlockchainMeta) => blockchain.name === requestedNetwork
  );
  const chainIdInHex = targetBlockchain?.chainId;

  const currentChainId = getChainIdByNetworkName(currentNetwork, meta);
  const currentChainEip = ChainId.format({
    namespace: NAMESPACES.ETHEREUM,
    reference: String(currentChainId),
  });

  try {
    await client.request({
      topic: session.topic,
      request: {
        method: EthereumRPCMethods.SWITCH_CHAIN,
        params: [
          {
            chainId: chainIdInHex,
          },
        ],
      },
      // It's required to pass current chain, otherwise it won't work
      chainId: currentChainEip,
    });
  } catch (err) {
    // EIP-1193 "Unrecognized chain ID" - the wallet doesn't have this chain yet.
    const addChainError = 4902;
    const { code, message } = (err ?? {}) as {
      code?: number;
      message?: string;
    };
    if (code === addChainError || message?.includes(String(addChainError))) {
      await client.request({
        topic: session.topic,
        request: {
          method: EthereumRPCMethods.ADD_CHAIN,
          params: [targetChain],
        },
        // It's required to pass current chain, otherwise it won't work
        chainId: currentChainEip,
      });
    } else {
      throw err;
    }
  }
}

/**
 * Adds the requested and current chains' accounts to the session so sign-client
 * accepts a request carrying their CAIP chain id, and returns the session to use
 * from here on.
 *
 * The record is rebuilt rather than pushed into: the struct is shared with the
 * store and the adapter cache, and the write below can fail (it is logged, not
 * thrown), which would otherwise leave both holding accounts the store never
 * accepted.
 */
export async function updateSessionAccounts(
  client: ISignClient,
  session: SessionTypes.Struct,
  requestedNetwork: string,
  currentNetwork: string,
  meta: BlockchainMeta[]
): Promise<SessionTypes.Struct> {
  const evmNamespace = session.namespaces[NAMESPACES.ETHEREUM];
  const currentAccountAddress = getCurrentEvmAccountAddress(session);
  if (!evmNamespace || !currentAccountAddress) {
    return session;
  }

  const existing = evmNamespace.accounts ?? [];
  const wanted = [
    getEvmAccount(requestedNetwork, currentAccountAddress, meta),
    getEvmAccount(currentNetwork, currentAccountAddress, meta),
  ].filter(
    (account): account is string => !!account && !existing.includes(account)
  );

  if (!wanted.length) {
    return session;
  }

  const updated: SessionTypes.Struct = {
    ...session,
    namespaces: {
      ...session.namespaces,
      [NAMESPACES.ETHEREUM]: {
        ...evmNamespace,
        accounts: [...existing, ...new Set(wanted)],
      },
    },
  };

  try {
    await client.session.update(session.topic, {
      namespaces: updated.namespaces,
    });
  } catch (err) {
    debug(err instanceof Error ? err : new Error(String(err)));
    return session;
  }

  return updated;
}

export function ignoreNamespaceMethods(session: SessionTypes.Struct): boolean {
  const WALLETS_WITH_WRONG_NAMESPACE_METHODS = ['trust', '1inch'];
  const peerName = session.peer?.metadata?.name;
  return WALLETS_WITH_WRONG_NAMESPACE_METHODS.some((name) =>
    peerName?.toLowerCase()?.includes(name)
  );
}
