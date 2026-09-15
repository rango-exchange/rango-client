import type { ISignClient } from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import { CHAIN_ID_STORAGE } from '../wcConstants.js';

export async function persistCurrentChainId(
  client: ISignClient,
  chainId?: string
) {
  return client.core.storage.setItem(CHAIN_ID_STORAGE, {
    defaultChainId: chainId ? parseInt(chainId) : '',
  });
}

export async function getPersistedChainId(client: ISignClient) {
  try {
    const chainId = (await client.core.storage.getItem(CHAIN_ID_STORAGE))
      ?.defaultChainId;
    return !!chainId ? String(chainId) : undefined;
  } catch {
    return undefined;
  }
}

export function getChainIdByNetworkName(
  network: string,
  meta: BlockchainMeta[]
): string | undefined {
  const targetBlockchain = meta.find(
    (blockchain) => blockchain.name === network
  );
  const chainIdInHex = targetBlockchain?.chainId;
  if (!chainIdInHex) {
    return undefined;
  }

  return String(parseInt(chainIdInHex));
}
