import type { SdkMeta } from '../context';
import type { Chain } from '@hub3js/evm';
import type { Asset, Token } from 'rango-sdk';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

/** The meta entry for a chain, by the name the API uses for it. */
export function findBlockchain(
  meta: SdkMeta,
  name: string
): BlockchainMeta | undefined {
  return meta.blockchains.find((blockchain) => blockchain.name === name);
}

/**
 * The meta entry for a token, matched the way the widget does: by chain,
 * symbol, and address, ignoring case. `undefined` when meta has no tokens.
 */
export function findToken(meta: SdkMeta, asset: Asset): Token | undefined {
  const wanted = tokenKey(asset);
  return meta.tokens?.find((token) => tokenKey(token) === wanted);
}

function tokenKey(asset: Asset): string {
  return [asset.blockchain, asset.symbol, asset.address ?? '']
    .join('-')
    .toLowerCase();
}

/** The chain id meta holds for a chain, to hand a signer. `null` when meta has none. */
export function getChainId(meta: SdkMeta, name: string): string | null {
  return findBlockchain(meta, name)?.chainId ?? null;
}

/**
 * Whether two chain ids name the same chain. Wallets report EVM chain ids as
 * hex (`0xa4b1`), meta as hex or decimal, so numeric ids are compared by
 * value; ids that are not numbers (`osmosis-1`) are compared as text.
 */
export function isSameChainId(a: string, b: string): boolean {
  return normalizeChainId(a) === normalizeChainId(b);
}

function normalizeChainId(chainId: string): string {
  try {
    return BigInt(chainId).toString();
  } catch {
    return chainId.toLowerCase();
  }
}

/** The EIP-3085 description of an EVM chain, which is what a wallet takes to switch to it. */
export function toEvmChain(blockchain: EvmBlockchainMeta): Chain {
  return {
    chainId: blockchain.chainId,
    chainName: blockchain.info.chainName,
    nativeCurrency: blockchain.info.nativeCurrency,
    rpcUrls: blockchain.info.rpcUrls,
    blockExplorerUrls: blockchain.info.blockExplorerUrls,
  };
}
