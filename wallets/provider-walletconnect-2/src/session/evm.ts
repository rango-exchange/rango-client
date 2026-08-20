/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BlockchainMeta } from 'rango-types';

import { debug } from '@rango-dev/logging-core';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  isEvmAddress,
} from '@rango-dev/wallets-shared';
import { AccountId, ChainId } from 'caip';
import { isEvmBlockchain } from 'rango-types';

import { EthereumRPCMethods, NAMESPACES } from '../wcConstants.js';

import { getChainIdByNetworkName } from './chain-state.js';

export function getCurrentEvmAccountAddress(instance: any) {
  return instance.session.namespaces.eip155.accounts
    ?.map((account: string) => {
      return new AccountId(account).address;
    })
    ?.filter((address: string) => isEvmAddress(address))?.[0];
}

export function getEvmAccount(
  network: string,
  address: string,
  meta: BlockchainMeta[]
) {
  const currentChainId = getChainIdByNetworkName(network, meta);
  return AccountId.format({
    chainId: {
      namespace: NAMESPACES.ETHEREUM,
      reference: String(currentChainId),
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
  meta: BlockchainMeta[],
  requestedNetwork: string,
  currentNetwork: string,
  instance: any
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

  const session = instance.session;

  try {
    await instance.client.request({
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
  } catch (err: any) {
    // EIP-1193 "Unrecognized chain ID" - the wallet doesn't have this chain yet.
    const addChainError = 4902;
    if (
      err?.code === addChainError ||
      err?.message?.includes(String(addChainError))
    ) {
      await instance.client.request({
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

export async function updateSessionAccounts(
  instance: any,
  requestedNetwork: string,
  currentNetwork: string,
  meta: BlockchainMeta[]
) {
  const session = instance.session;

  const namespaces = session.namespaces;
  let needUpdateNamespace = false;
  const accounts = namespaces.eip155.accounts;

  const currentAccountAddress = getCurrentEvmAccountAddress(instance);
  const requestedAccount = getEvmAccount(
    requestedNetwork,
    currentAccountAddress,
    meta
  );
  if (!accounts.includes(requestedAccount)) {
    accounts.push(requestedAccount);
    needUpdateNamespace = true;
  }

  const currentAccount = getEvmAccount(
    currentNetwork,
    currentAccountAddress,
    meta
  );
  if (!accounts.includes(currentAccount)) {
    accounts.push(currentAccount);
    needUpdateNamespace = true;
  }

  if (needUpdateNamespace) {
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
        debug(err instanceof Error ? err : new Error(String(err)));
      });
  }
}

export function ignoreNamespaceMethods(instance: any): boolean {
  const WALLETS_WITH_WRONG_NAMESPACE_METHODS = ['trust', '1inch'];
  const peerName = instance?.session?.peer?.metadata?.name;
  return WALLETS_WITH_WRONG_NAMESPACE_METHODS.some((name) =>
    peerName?.toLowerCase()?.includes(name)
  );
}
